export function PROCESS_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "";
        }
        case "staging": {
            return "";
        }
        case "production": {
            return "";
        }
    }
    return "";
}
