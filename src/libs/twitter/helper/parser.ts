/**
 * Copied from https://github.com/Rishikant181/Rettiwt-API/blob/e2df415c131582d6c534bbbc2976afabd0bbc43e/src/services/helper/Parser.ts
 */

/**
 * @returns Whether the given json object is empty or not
 * @param data The input JSON object which needs to be checked
 */
export function isJSONEmpty(data: any): boolean {
    // If the JSON has any keys, it's not empty
    if (Object.keys(data).length === 0) {
        return true;
    }
    // Else, it's empty

    return false;
}

/**
 * @param text The text to be normalized
 * @returns The text after being formatted to remove unnecessary characters
 */
export function normalizeText(text: string): string {
    let normalizedText: string = ''; // To store the normalized text

    // Removing unnecessary full stops, and other characters
    normalizedText = text.replace(/\n/g, '.').replace(/[.]+[\s+.\s+]+/g, '. ');

    // Adding full-stop to the end if does not exist already
    normalizedText = normalizedText.endsWith('.')
        ? normalizedText
        : `${normalizedText}.`;

    return normalizedText;
}
