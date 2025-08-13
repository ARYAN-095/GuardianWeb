# app/analyzer/ai_utils.py

import logging
from typing import Dict, List, Optional
import json

from app.genai.ai_assistant import AIAssistant

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Assistant initialization (tweak model_name / params as needed)
assistant = AIAssistant(model_name="google/flan-t5-base")


def _call_assistant_with_fallback(prompt: str) -> str:
    """
    Attempt to call the assistant using several likely method names.
    This keeps compatibility across small API differences in AIAssistant.
    """
    candidate_methods = [
        "generate_fix_suggestion",  # your current hint
        "generate_text",
        "ask",
        "complete",
        "call",
        "send",
    ]

    for method_name in candidate_methods:
        method = getattr(assistant, method_name, None)
        if callable(method):
            try:
                # try calling with just the prompt; many wrappers accept additional kwargs
                # but we avoid assuming exact signature to keep this generic.
                logger.debug("Calling assistant.%s", method_name)
                return method(prompt)  # if method needs extra args, it should be adapted.
            except TypeError:
                # If signature differs (e.g., method(prompt=..., max_tokens=...)), try with keyword.
                try:
                    return method(prompt=prompt)
                except Exception as e:
                    logger.debug("assistant.%s failed with keyword call: %s", method_name, e)
            except Exception as e:
                logger.warning("assistant.%s raised exception: %s", method_name, e)

    # Final fallback: if no compatible method is found
    logger.error("No compatible assistant method found or all calls failed.")
    raise RuntimeError("Unable to call AIAssistant (no compatible method).")


def gen_anomaly_summary(anomalies: List[Dict]) -> str:
    """
    Produce a high-level summary for a list of anomalies.
    Keeps the previous behavior but adds error handling and graceful fallback.
    """
    try:
        if hasattr(assistant, "summarize_anomalies"):
            return assistant.summarize_anomalies(anomalies)
        # fallback: create a simple human summary if assistant lacks that convenience method
        lines = []
        lines.append(f"Found {len(anomalies)} anomaly(ies).")
        for a in anomalies[:5]:
            lines.append(f"- {a.get('message', 'unknown issue')} (severity: {a.get('severity')})")
        if len(anomalies) > 5:
            lines.append(f"...and {len(anomalies)-5} more.")
        return "\n".join(lines)
    except Exception as e:
        logger.exception("Error generating anomaly summary: %s", e)
        return "Summary generation failed — see logs for details."


def gen_fix_snippet(anomaly: Dict) -> str:
    """
    Generate a concise, actionable recommendation for a single anomaly by requesting
    a structured JSON object from the model.
    """
    # Defensive defaults for creating the prompt
    issue_type = anomaly.get("type", "unknown")
    severity = anomaly.get("severity", "unknown")
    message = anomaly.get("message", anomaly.get("description", "No description provided."))

    prompt = (
        "You are a pragmatic web security and performance expert. "
        "A scan found this issue and you must respond **only** with a JSON object (no extra text).\n\n"
        f"Issue summary:\n- type: {issue_type}\n- severity: {severity}\n- description: {message}\n\n"
        "Required JSON schema (strict):\n"
        "{\n"
        '  "recommendation": "<ONE-SENTENCE direct instruction>",\n'
        '  "steps": ["<short step 1>", "<short step 2>"],\n'
        '  "example_fix": "<small code snippet or CLI>",\n'
        '  "rationale": "<ONE-SENTENCE reason why this fixes the issue>"\n'
        "}\n\n"
        "Constraints:\n"
        "- Keep `recommendation` to a single, direct sentence (no mention of severity/type).\n"
        "- `steps` should contain 0–3 short actionable steps (if not applicable, return empty array).\n"
        "- `example_fix` should be at most 6 lines; prefer a config or single command. If none, return an empty string.\n"
        "- `rationale` should be 1 sentence.\n"
        "- Return valid JSON only; do not include explanations or extra fields.\n\n"
        "Now produce the JSON object."
    )

    try:
        model_response = _call_assistant_with_fallback(prompt)

        # Best-effort: try to parse if it's a JSON string directly.
        try:
            data = json.loads(model_response)
            # Normalize fields into a compact, human-readable snippet string for consumers.
            recommendation = data.get("recommendation", "").strip()
            steps = data.get("steps") or []
            example_fix = data.get("example_fix", "").strip()
            rationale = data.get("rationale", "").strip()

            # Build final short text output (the function returns a string).
            output_lines = [recommendation]
            if steps:
                output_lines.append("\nSteps:")
                for i, s in enumerate(steps, 1):
                    output_lines.append(f"{i}. {s}")
            if example_fix:
                output_lines.append("\nExample fix:")
                output_lines.append(example_fix)
            if rationale:
                output_lines.append(f"\nRationale: {rationale}")

            return "\n".join(output_lines).strip()
        except Exception:
            # If parsing fails, return the raw response but log warning.
            logger.warning("Could not parse assistant response as JSON; returning raw text.")
            return model_response.strip()
    except Exception as e:
        logger.exception("gen_fix_snippet failed: %s", e)
        # Safe fallback recommendation (explicit, short)
        fallback = anomaly.get(
            "recommendation",
            "Investigate the issue and add the appropriate fix based on best practices."
        )
        return f"{fallback} (automatic suggestion fallback)"
