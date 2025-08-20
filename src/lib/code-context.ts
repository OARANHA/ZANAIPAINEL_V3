import * as fs from 'fs';
import * as path from 'path';

interface CodeFile {
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: Date;
  dependencies: string[];
  exports: string[];
  imports: string[];
  functions: Array<{
    name: string;
    params: string[];
    returnType?: string;
    line: number;
  }>;
  classes: Array<{
    name: string;
    methods: string[];
    line: number;
  }>;
  complexity: number;
}

interface ProjectStructure {
  rootPath: string;
  files: CodeFile[];
  directories: string[];
  packageJson?: any;
  configFiles: Record<string, any>;
  dependencies: {
    production: string[];
    development: string[];
  };
  technologies: string[];
  architecture: {
    type: 'monolith' | 'microservices' | 'serverless' | 'monorepo';
    frameworks: string[];
    patterns: string[];
  };
}

export class CodeContextService {
  static async analyzeProject(rootPath: string): Promise<ProjectStructure> {
    try {
      const files: CodeFile[] = [];
      const directories: string[] = [];
      const configFiles: Record<string, any> = {};
      
      // Walk through directory
      await this.walkDirectory(rootPath, files, directories, rootPath);
      
      // Analyze package.json
      let packageJson: any = null;
      const packageFile = files.find(f => f.path.endsWith('package.json'));
      if (packageFile) {
        packageJson = JSON.parse(packageFile.content);
      }
      
      // Analyze config files
      const configExtensions = ['.json', '.yaml', '.yml', '.toml', '.config.js', '.config.ts'];
      files.forEach(file => {
        if (configExtensions.some(ext => file.path.endsWith(ext))) {
          try {
            const fileName = path.basename(file.path);
            if (fileName.includes('config') || ['package.json', 'tsconfig.json', 'tailwind.config.js'].includes(fileName)) {
              configFiles[fileName] = JSON.parse(file.content);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      });
      
      // Extract dependencies
      const dependencies = this.extractDependencies(packageJson);
      
      // Detect technologies
      const technologies = this.detectTechnologies(files, packageJson);
      
      // Analyze architecture
      const architecture = this.analyzeArchitecture(files, technologies);
      
      return {
        rootPath,
        files,
        directories,
        packageJson,
        configFiles,
        dependencies,
        technologies,
        architecture
      };
    } catch (error) {
      console.error('Error analyzing project:', error);
      throw error;
    }
  }

  private static async walkDirectory(
    dirPath: string, 
    files: CodeFile[], 
    directories: string[], 
    rootPath: string
  ) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.git', '.next', '.out', 'dist', 'build'].includes(entry.name)) {
          directories.push(relativePath);
          await this.walkDirectory(fullPath, files, directories, rootPath);
        }
      } else {
        // Skip binary files and large files
        if (this.shouldAnalyzeFile(entry.name) && fs.statSync(fullPath).size < 1024 * 1024) { // 1MB limit
          const codeFile = await this.analyzeFile(fullPath, relativePath);
          if (codeFile) {
            files.push(codeFile);
          }
        }
      }
    }
  }

  private static shouldAnalyzeFile(filename: string): boolean {
    const textExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
      '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.scala', '.cs',
      '.html', '.css', '.scss', '.sass', '.less', '.json', '.yaml', '.yml',
      '.md', '.txt', '.xml', '.sql', '.sh', '.bash', '.zsh', '.ps1'
    ];
    
    return textExtensions.some(ext => filename.endsWith(ext)) || 
           filename.includes('config') || 
           filename === 'package.json' ||
           filename === 'README.md';
  }

  private static async analyzeFile(fullPath: string, relativePath: string): Promise<CodeFile | null> {
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const stats = fs.statSync(fullPath);
      const language = this.detectLanguage(relativePath);
      
      return {
        path: relativePath,
        content,
        language,
        size: stats.size,
        lastModified: stats.mtime,
        dependencies: this.extractDependenciesFromFile(content, language),
        exports: this.extractExports(content, language),
        imports: this.extractImports(content, language),
        functions: this.extractFunctions(content, language),
        classes: this.extractClasses(content, language),
        complexity: this.calculateComplexity(content, language)
      };
    } catch (error) {
      console.error(`Error analyzing file ${relativePath}:`, error);
      return null;
    }
  }

  private static detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'javascript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.h': 'c',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.scala': 'scala',
      '.cs': 'csharp',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
      '.xml': 'xml',
      '.sql': 'sql',
      '.sh': 'bash',
      '.bash': 'bash',
      '.zsh': 'zsh',
      '.ps1': 'powershell'
    };
    
    return languageMap[ext] || 'unknown';
  }

  private static extractDependencies(packageJson: any): { production: string[]; development: string[] } {
    if (!packageJson) return { production: [], development: [] };
    
    return {
      production: Object.keys(packageJson.dependencies || {}),
      development: Object.keys(packageJson.devDependencies || {})
    };
  }

  private static extractDependenciesFromFile(content: string, language: string): string[] {
    const dependencies: string[] = [];
    
    if (language === 'javascript' || language === 'typescript') {
      // Extract import statements
      const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        dependencies.push(match[1]);
      }
      
      // Extract require statements
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
      while ((match = requireRegex.exec(content)) !== null) {
        dependencies.push(match[1]);
      }
    } else if (language === 'python') {
      // Extract import statements
      const importRegex = /^(?:from\s+(\S+)\s+)?import\s+(\S+)/gm;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        dependencies.push(match[1] || match[2]);
      }
    }
    
    return [...new Set(dependencies)];
  }

  private static extractExports(content: string, language: string): string[] {
    const exports: string[] = [];
    
    if (language === 'javascript' || language === 'typescript') {
      // Extract export statements
      const exportRegex = /export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g;
      let match;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
      }
      
      // Extract named exports
      const namedExportRegex = /export\s+{\s*([^}]+)\s*}/g;
      while ((match = namedExportRegex.exec(content)) !== null) {
        const names = match[1].split(',').map(name => name.trim());
        exports.push(...names);
      }
    }
    
    return [...new Set(exports)];
  }

  private static extractImports(content: string, language: string): string[] {
    const imports: string[] = [];
    
    if (language === 'javascript' || language === 'typescript') {
      // Extract named imports
      const namedImportRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"][^'"]+['"]/g;
      let match;
      while ((match = namedImportRegex.exec(content)) !== null) {
        const names = match[1].split(',').map(name => name.trim());
        imports.push(...names);
      }
    }
    
    return [...new Set(imports)];
  }

  private static extractFunctions(content: string, language: string): Array<{ name: string; params: string[]; returnType?: string; line: number }> {
    const functions: Array<{ name: string; params: string[]; returnType?: string; line: number }> = [];
    const lines = content.split('\n');
    
    if (language === 'javascript' || language === 'typescript') {
      // Function declarations
      const functionRegex = /(?:function\s+(\w+)|(\w+)\s*[:=]\s*(?:function|\([^)]*\)\s*=>))\s*\(([^)]*)\)/g;
      let match;
      
      lines.forEach((line, index) => {
        while ((match = functionRegex.exec(line)) !== null) {
          const name = match[1] || match[2];
          const params = match[3] ? match[3].split(',').map(p => p.trim()) : [];
          functions.push({ name, params, line: index + 1 });
        }
      });
    } else if (language === 'python') {
      // Python function definitions
      const pythonRegex = /def\s+(\w+)\s*\(([^)]*)\)/g;
      
      lines.forEach((line, index) => {
        while ((match = pythonRegex.exec(line)) !== null) {
          const name = match[1];
          const params = match[2] ? match[2].split(',').map(p => p.trim()) : [];
          functions.push({ name, params, line: index + 1 });
        }
      });
    }
    
    return functions;
  }

  private static extractClasses(content: string, language: string): Array<{ name: string; methods: string[]; line: number }> {
    const classes: Array<{ name: string; methods: string[]; line: number }> = [];
    const lines = content.split('\n');
    
    if (language === 'javascript' || language === 'typescript') {
      // Class declarations
      const classRegex = /class\s+(\w+)/g;
      let match;
      
      lines.forEach((line, index) => {
        while ((match = classRegex.exec(line)) !== null) {
          const name = match[1];
          const methods = this.extractMethods(content, language, index);
          classes.push({ name, methods, line: index + 1 });
        }
      });
    } else if (language === 'python') {
      // Python class definitions
      const pythonRegex = /class\s+(\w+)/g;
      
      lines.forEach((line, index) => {
        while ((match = pythonRegex.exec(line)) !== null) {
          const name = match[1];
          const methods = this.extractMethods(content, language, index);
          classes.push({ name, methods, line: index + 1 });
        }
      });
    }
    
    return classes;
  }

  private static extractMethods(content: string, language: string, startLine: number): string[] {
    const methods: string[] = [];
    const lines = content.split('\n');
    
    // Look for methods within the next 50 lines
    for (let i = startLine; i < Math.min(startLine + 50, lines.length); i++) {
      const line = lines[i];
      
      if (language === 'javascript' || language === 'typescript') {
        const methodRegex = /(\w+)\s*\([^)]*\)\s*{/g;
        const match = methodRegex.exec(line);
        if (match) {
          methods.push(match[1]);
        }
      } else if (language === 'python') {
        const pythonRegex = /def\s+(\w+)\s*\([^)]*\)/g;
        const match = pythonRegex.exec(line);
        if (match) {
          methods.push(match[1]);
        }
      }
    }
    
    return methods;
  }

  private static calculateComplexity(content: string, language: string): number {
    let complexity = 1; // Base complexity
    
    // Count decision points
    const decisionKeywords = ['if', 'else', 'elif', 'for', 'while', 'switch', 'case', 'catch', 'try'];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      decisionKeywords.forEach(keyword => {
        if (line.includes(keyword)) {
          complexity++;
        }
      });
    });
    
    // Count logical operators
    const logicalOperators = ['&&', '||', 'and', 'or'];
    lines.forEach(line => {
      logicalOperators.forEach(op => {
        if (line.includes(op)) {
          complexity += 0.5;
        }
      });
    });
    
    return Math.round(complexity);
  }

  private static detectTechnologies(files: CodeFile[], packageJson: any): string[] {
    const technologies: string[] = [];
    
    // Check package.json dependencies
    if (packageJson) {
      const allDeps = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {})
      ];
      
      // Framework detection
      if (allDeps.includes('react')) technologies.push('React');
      if (allDeps.includes('vue')) technologies.push('Vue.js');
      if (allDeps.includes('angular')) technologies.push('Angular');
      if (allDeps.includes('next')) technologies.push('Next.js');
      if (allDeps.includes('nuxt')) technologies.push('Nuxt.js');
      if (allDeps.includes('express')) technologies.push('Express.js');
      if (allDeps.includes('fastify')) technologies.push('Fastify');
      if (allDeps.includes('nestjs')) technologies.push('NestJS');
      if (allDeps.includes('django')) technologies.push('Django');
      if (allDeps.includes('flask')) technologies.push('Flask');
      if (allDeps.includes('spring')) technologies.push('Spring');
      
      // Database detection
      if (allDeps.includes('mongoose') || allDeps.includes('mongodb')) technologies.push('MongoDB');
      if (allDeps.includes('pg') || allDeps.includes('postgres')) technologies.push('PostgreSQL');
      if (allDeps.includes('mysql') || allDeps.includes('mysql2')) technologies.push('MySQL');
      if (allDeps.includes('sqlite3')) technologies.push('SQLite');
      if (allDeps.includes('redis')) technologies.push('Redis');
      
      // Testing frameworks
      if (allDeps.includes('jest')) technologies.push('Jest');
      if (allDeps.includes('mocha')) technologies.push('Mocha');
      if (allDeps.includes('cypress')) technologies.push('Cypress');
      if (allDeps.includes('selenium')) technologies.push('Selenium');
      
      // Build tools
      if (allDeps.includes('webpack')) technologies.push('Webpack');
      if (allDeps.includes('vite')) technologies.push('Vite');
      if (allDeps.includes('rollup')) technologies.push('Rollup');
      if (allDeps.includes('typescript')) technologies.push('TypeScript');
      if (allDeps.includes('babel')) technologies.push('Babel');
    }
    
    // Check file extensions and patterns
    const hasTsFiles = files.some(f => f.path.endsWith('.ts') || f.path.endsWith('.tsx'));
    const hasPyFiles = files.some(f => f.path.endsWith('.py'));
    const hasJavaFiles = files.some(f => f.path.endsWith('.java'));
    const hasGoFiles = files.some(f => f.path.endsWith('.go'));
    const hasRustFiles = files.some(f => f.path.endsWith('.rs'));
    
    if (hasTsFiles && !technologies.includes('TypeScript')) technologies.push('TypeScript');
    if (hasPyFiles) technologies.push('Python');
    if (hasJavaFiles) technologies.push('Java');
    if (hasGoFiles) technologies.push('Go');
    if (hasRustFiles) technologies.push('Rust');
    
    return [...new Set(technologies)];
  }

  private static analyzeArchitecture(files: CodeFile[], technologies: string[]): {
    type: 'monolith' | 'microservices' | 'serverless' | 'monorepo';
    frameworks: string[];
    patterns: string[];
  } {
    let type: 'monolith' | 'microservices' | 'serverless' | 'monorepo' = 'monolith';
    const frameworks: string[] = [];
    const patterns: string[] = [];
    
    // Detect architecture type
    const hasPackageJson = files.some(f => f.path.endsWith('package.json'));
    const hasMultiplePackageJson = files.filter(f => f.path.endsWith('package.json')).length > 1;
    const hasDockerfile = files.some(f => f.path.toLowerCase().includes('dockerfile'));
    const hasServerlessConfig = files.some(f => f.path.includes('serverless'));
    
    if (hasMultiplePackageJson) {
      type = 'monorepo';
    } else if (hasServerlessConfig) {
      type = 'serverless';
    } else if (hasDockerfile && technologies.includes('Express.js')) {
      type = 'microservices';
    }
    
    // Extract frameworks
    frameworks.push(...technologies.filter(t => 
      ['React', 'Vue.js', 'Angular', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring'].includes(t)
    ));
    
    // Detect patterns
    if (files.some(f => f.path.includes('controller') || f.path.includes('routes'))) {
      patterns.push('MVC');
    }
    
    if (files.some(f => f.path.includes('service') || f.path.includes('repository'))) {
      patterns.push('Repository Pattern');
    }
    
    if (files.some(f => f.path.includes('middleware'))) {
      patterns.push('Middleware Pattern');
    }
    
    if (files.some(f => f.path.includes('hook') || f.path.includes('use'))) {
      patterns.push('Hooks Pattern');
    }
    
    return {
      type,
      frameworks,
      patterns
    };
  }
}