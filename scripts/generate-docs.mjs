import { generateFiles } from 'fumadocs-openapi';
 
void generateFiles({
  input: ['./nxai-bot.openapi2.yaml'], // the OpenAPI schemas
  output: './content/docs/api2',
  // we recommend to enable it
  // make sure your endpoint description doesn't break MDX syntax.
  includeDescription: true,
});