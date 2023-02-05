interface GeditContext {
  _attributes: {
    id: string;
    'style-ref': string;
  };
  match: {
    _attributes: {
      extended: string;
    };
    _text: string;
  };
  prefix: {
    _text: string;
  };
  suffix: {
    _text: string;
  };
  keyword: { _text: string }[];
}

interface GeditFile {
  _declaration: {
    _attributes: {
      version: string;
      encoding: string;
    };
  };
  _comment: string;
  language: {
    _attributes: {
      id: string;
      name: string;
      version: string;
      _section: string;
    };
    metadata: {
      property: GeditProperty[];
    };
    styles: {
      style: GeditStyle[];
    };
    definitions: {
      'define-regex': GeditProperty[];
      context: GeditContext[];
      _comment: string[];
    };
  };
}

interface GeditProperty {
  _attributes: {
    name: string;
  };
  _text: string;
}

interface GeditStyle {
  _attributes: {
    id: string;
    name: string;
    'map-to': string;
  };
}

export { GeditContext, GeditFile, GeditProperty, GeditStyle };
