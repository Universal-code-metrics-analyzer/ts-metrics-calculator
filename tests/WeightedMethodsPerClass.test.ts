const text = `
class A {
  prop1 = 1
  
  method1() {
    const foo = 'bla';
    if (confIndex === -1) {
      console.error('Error: please, specify the path to configuration JSON file');
      for(const i = 0; i < 20; i++) {
        if (i % 2 == 0) return 2;
        else {
          for(const i = 0; i < 20; i++) {
            if (i % 2 == 0) return 2;
            else return 1;
          }
        }
      }
      process.exit(1);
    } else if (gigi_gaga > 0) {
      for(const i = 0; i < 20; i++) {
        if (i % 2 == 0) return 2;
        else return 1;
      }
    }
  }

  method2() {
    const a = 3;
    var c;
    const b = 4;
    if (a > b) {
      c = a
    } else {
      c = b
    }
    console.log(c);
  }

  method3() {
    var jsonData;

    var ext = path.extname(cmd.argumentDatasource.filename).toLowerCase();
    var rawData  = fs.readFileSync(cmd.argumentDatasource.filename).toString();
    switch(ext) {
        case ".config":
            jsonData = xml.parseString(rawData);
            break;
        case ".xml":
            jsonData = xml.parseString(rawData);
            break;
        case ".json":
            jsonData = JSON.parse(cmd.argumentDatasource.filename);
            break;
        case ".js":
            jsonData = require(cmd.argumentDatasource.filename);
            break;
        default:
            var msg = colors.bgRed.white(cmd.argumentDatasource.filename + " not supported as data storage");
            console.log(msg);
    }
    return jsonData;
  }
}
`;