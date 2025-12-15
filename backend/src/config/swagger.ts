import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerYamlPath = path.join(__dirname, "swagger.yaml")
const swaggerDocument = yaml.load(
  fs.readFileSync(swaggerYamlPath, "utf8")
) as Record<string, any>

export const swaggerSpec = swaggerDocument
