import { generateFiles } from 'fumadocs-openapi';
 
void generateFiles({
  input: ['./nxai-bot.openapi.yaml'], // the OpenAPI schemas
  output: './content/docs/api',
  // we recommend to enable it
  // make sure your endpoint description doesn't break MDX syntax.
  includeDescription: true,
  groupBy: 'route', // 只按路由最后一级分组
  name: (type, name) => {
    // 这里的 name 是路径最后一级，比如 'list'
    // 你可以返回 `${tag}-${name}` 或 `${name}-${type}` 等
    // 但 operation 模式下，name 只对 tag/file 有效
    return name;
  }
});

