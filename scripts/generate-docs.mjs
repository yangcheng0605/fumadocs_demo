import { generateFiles } from 'fumadocs-openapi';
 
void generateFiles({
  input: ['./nxai-bot.openapi.yaml'], // the OpenAPI schemas
  output: './content/docs/aiagent',
  includeDescription: true,
  per: 'tag',
  // groupBy: 'tag',
});

