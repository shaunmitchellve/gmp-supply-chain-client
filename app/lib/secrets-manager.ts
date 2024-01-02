import { SecretManagerServiceClient }from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const GCP_PROJECT_PREFIX = `projects/${process.env.PROJECT_ID}/secrets/`;

export async function getSecret(name: string, version?: string) {
    if (!version) {
        version = "latest"
    }

    try {
        const [secretVersion] = await client.accessSecretVersion({
            name: GCP_PROJECT_PREFIX + name + "/versions/" + version,
        });

        if(!secretVersion.payload) {
            throw new Error("No Paylod for secret: " + name)
        } else if(!secretVersion.payload.data) {
            throw new Error("No Secret Payload data for: " + name);
        }

        return secretVersion.payload.data.toString();
    } catch (err) {
        throw err;
    }
}