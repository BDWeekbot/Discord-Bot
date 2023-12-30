import { getEnvVar} from "./utils/env.js";

export const Keys = {
    clientToken: getEnvVar( 'token')
} as const;

export default Keys;