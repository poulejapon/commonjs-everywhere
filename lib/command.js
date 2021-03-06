// Generated by CoffeeScript 2.0.0-beta4
void function () {
  var $0, cache$, cache$1, CJSEverywhere, code, combined, escodegen, escodegenFormat, esmangle, fs, Jedediah, map, optionParser, options, path, positionalArgs, root;
  fs = require('fs');
  path = require('path');
  escodegen = require('escodegen');
  Jedediah = require('jedediah');
  CJSEverywhere = require('./index');
  optionParser = new Jedediah;
  optionParser.addOption('help', false, 'display this help message');
  optionParser.addOption('minify', 'm', false, 'minify output');
  optionParser.addOption('verbose', 'v', false, 'verbose output sent to stderr');
  optionParser.addParameter('export', 'x', 'NAME', 'export the given entry module as NAME');
  optionParser.addParameter('output', 'o', 'FILE', 'output to FILE instead of stdout');
  optionParser.addParameter('root', 'r', 'DIR', 'unqualified requires are relative to DIR (default: cwd)');
  optionParser.addParameter('source-map-file', 'FILE', 'output a source map to FILE');
  cache$ = optionParser.parse(process.argv);
  options = cache$[0];
  positionalArgs = cache$[1];
  if (options.help) {
    $0 = process.argv[0] === 'node' ? process.argv[1] : process.argv[0];
    $0 = path.basename($0);
    console.log('\n  Usage: ' + $0 + ' OPT* path/to/entry-file.{js,coffee} OPT*\n\n' + optionParser.help() + '\n');
    process.exit(0);
  }
  if (!(positionalArgs.length === 1))
    throw new Error('wrong number of entry points given; expected 1');
  root = options.root ? path.resolve(options.root) : process.cwd();
  combined = CJSEverywhere.cjsify(positionalArgs[0], root, options);
  escodegenFormat = {
    indent: {
      style: '  ',
      base: 0
    },
    renumber: true,
    hexadecimal: true,
    quotes: 'auto',
    parentheses: false
  };
  if (options.minify) {
    esmangle = require('esmangle');
    combined = esmangle.mangle(esmangle.optimize(combined), { destructive: true });
    escodegenFormat = {
      indent: {
        style: '',
        base: 0
      },
      renumber: true,
      hexadecimal: true,
      quotes: 'auto',
      escapeless: true,
      compact: true,
      parentheses: false,
      semicolons: false
    };
  }
  cache$1 = escodegen.generate(combined, {
    comment: false,
    sourceMap: true,
    sourceMapWithCode: true,
    sourceMapRoot: root,
    format: escodegenFormat
  });
  code = cache$1.code;
  map = cache$1.map;
  if (options['source-map-file']) {
    fs.writeFileSync(options['source-map-file'], '' + map);
    code += '\n/*\n//@ sourceMappingURL=' + options['source-map-file'] + '\n*/';
  }
  if (options.output) {
    fs.writeFileSync(options.output, code);
  } else {
    process.stdout.write('' + code + '\n');
  }
}.call(this);
