
export default function litTmplWrap(taggedTemplate, tmplData) {
  return function getLitPug(name, args) {
    return tmplData[name](taggedTemplate, args);
  };
}

