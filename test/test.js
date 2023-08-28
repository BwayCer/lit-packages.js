
import Benchmark from 'benchmark';
// import {litStates} from '../src/litState.js';


function holdCompetition(globalData, setup, contestants) {
  Object.assign(global, globalData);

  Benchmark.prototype.setup = setup
  let suite = new Benchmark.Suite;
  suite.setup = setup;
  contestants.forEach(contestant => suite.add(contestant));
  suite
    .on('cycle', function(event) {
      console.log(event.target.toString());
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run()
  ;

  Object.keys(globalData).forEach(key => Reflect.deleteProperty(global, key));
}

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}


holdCompetition(
  {},
  function _setupA() {
    // state:                   0       1        2     3
    // |------------------------|-------|--------|-----|
    //   undefined + pure value   Array   Object   ...
    function _modelTypeofInfo(value) {
      let name = '';
      let state = 0;
      switch (value == null ? value : value.constructor) {
        case undefined:
          name = 'undefined';
          break;
        case null:
          name = 'null';
          break;
        case String:
          name = 'string';
          break;
        case Number:
          name = isNaN(value) ? 'null' : 'number';
          break;
        case Boolean:
          name = 'boolean';
          break;
        case Array:
          name = 'array';
          state = 1;
          break;
        case Object:
          name = 'object';
          state = 2;
          break;
        default:
          name = 'other';
          state = 3;
          break;
      }
      return {name, state};
    }

    function _transformPureData2(value, keyName, data) {
      switch (_modelTypeofInfo(value)) {
        case 0:
          data[keyName] = null;
          break;
        // case 1:
          // data[keyName] = value;
          // break;
        // case 2: {
          // let newData = data[keyName] = [];
          // value.forEach((val, idx) => _transformPureData(val, idx, newData));
          // break;
        // }
        // case 3: {
          // let newData = data[keyName] = {};
          // Object.entries(value).forEach(
            // item => _transformPureData(item[1], item[0], newData)
          // );
          // break;
        // }
      }
      return data;
    }
    function _transformPureData(value, keyName, data) {
      return _transformPureData2(value, 0, [])[0];
    }

    let arrayTmpl = {
      x1: {
        x1: Array.from({length: 99}, (_, idx) => idx),
        x2: 0,
        x3: 'A',
        x4: true,
      },
      data: {
        "glossary": {
          "title": "example glossary",
          "GlossDiv": {
            "title": "S",
            "GlossList": {
              "GlossEntry": {
                "ID": "SGML",
                "SortAs": "SGML",
                "GlossTerm": "Standard Generalized Markup Language",
                "Acronym": "SGML",
                "Abbrev": "ISO 8879:1986",
                "GlossDef": {
                  "para": "A meta-markup language, used to create markup languages such as DocBook.",
                  "GlossSeeAlso": ["GML", "XML"]
                },
                "GlossSee": "markup"
              }
            }
          }
        }
      }
    };
  },
  [
    {
      name: 'transformPureData',
      fn: function () {
        let data = _transformPureData(arrayTmpl);
        if (arrayTmpl.x1.x4 !== true) {
          console.log('transformPureData 錯誤');
          throw Error();
        }
      },
    },
    {
      name: 'JSON.parse',
      fn: function () {
        let data = JSON.parse(JSON.stringify(arrayTmpl));
        if (arrayTmpl.x1.x4 !== true) {
          console.log('litStates#createData 錯誤');
          throw Error();
        }
      },
    }
  ],
);

(new Benchmark.Suite)
  .on('cycle', function(event) {
    console.log(event.target.toString());
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run()
;

