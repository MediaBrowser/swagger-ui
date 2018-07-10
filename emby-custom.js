
var _extends =
    Object.assign ||
        function(target) {
            for (let i = 1; i < arguments.length; i++) {
                const source = arguments[i];
                for (let key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };


function caseInsensitivePhraseFilter() {
    return {
        fn: {
            opsFilter: (taggedOps, phrase) => {
                const phrases = phrase.toUpperCase().split(' ');

                return taggedOps.filter((val, key) => {
                    return phrases.find((text) => key.toUpperCase().indexOf(text.trim()) !== -1);
                });
            }
        }
    };
}

function renderEnum() {
    return {
        wrapComponents: {
            EnumModel: (OriginalComponent, system) => (props) => {

                var values = system.React.createElement('span',
                    { className: 'prop-enumvalues' },
                    `(${props.value.join(', ')})`);
                return system.React.createElement('span', { className: 'prop-enum' }, '($enum)', values);
            }
        }
    };
};

function renderArray() {
    return {
        wrapComponents: {
            ArrayModel: (OriginalComponent, system) => (props) => {

                const { getComponent, getConfigs, schema, depth, expandDepth, name, displayName, specPath } = props;

                const description = schema.get('description');
                const items = schema.get('items');
                const title = schema.get('title') || displayName || name;
                const properties = schema.filter(
                    (v, key) => ['type', 'items', 'description', '$$ref'].indexOf(key) === -1
                );

                const Markdown = getComponent('Markdown');
                const ModelCollapse = getComponent('ModelCollapse');
                const Model = getComponent('Model');
                const Property = getComponent('Property');

                const titleEl =
                    title &&
                        system.React.createElement(
                            'span',
                            { className: 'model-title' },
                            system.React.createElement('span', { className: 'model-title__text' }, title)
                        );

                return system.React.createElement(
                    'span',
                    { className: 'model' },
                    '[',
                    system.React.createElement(
                        'span',
                        null,
                        system.React.createElement(
                            Model,
                            _extends({},
                                props,
                                {
                                    getConfigs: getConfigs,
                                    specPath: specPath.push('items'),
                                    name: null,
                                    schema: items,
                                    required: false,
                                    depth: depth
                                })
                        )
                    ),
                    properties.size
                    ? properties
                    .entrySeq()
                    .map(([key, v]) =>
                        system.React.createElement(Property,
                            {
                                key: `${key}-${v}`,
                                propKey: key,
                                propVal: v,
                                propStyle: propStyle
                            })
                    )
                    : null,
                    !description
                    ? properties.size
                    ? system.React.createElement('div', { className: 'markdown' })
                    : null
                    : system.React.createElement(Markdown, { source: description }),
                    ']'
                );
            }
        }
    };
};

function renderPrimitive() {
    return {
        wrapComponents: {
            PrimitiveModel: (OriginalComponent, system) => (props) => {

                const { schema, getComponent, getConfigs, name, displayName, depth } = props;

                const { showExtensions } = getConfigs();

                if (!schema || !schema.get) {
                    // don't render if schema isn't correctly formed
                    return system.React.createElement('div', null);
                }

                const type = schema.get('type');
                let format = schema.get('format');
                const nullable = schema.get('nullable');
                const xml = schema.get('xml');
                const enumArray = schema.get('enum');
                const title = schema.get('title') || displayName || name;
                const description = schema.get('description');
                //let extensions = getExtensions(schema);
                const properties = schema
                    .filter((v, key) => ['enum', 'type', 'format', 'description', 'nullable', '$$ref'].indexOf(key) ===
                        -1)
                    .filterNot((v, key) => extensions.has(key));
                const Markdown = getComponent('Markdown');
                const EnumModel = getComponent('EnumModel');
                const Property = getComponent('Property');

                if (format && format.length > 0) {

                    format = `$${format}`;

                    if (nullable === true) {
                        format += ', nullable';
                    }
                } else if (nullable === true) {
                    format = 'nullable';
                }

                return system.React.createElement('span',
                    { className: 'model' },
                    system.React.createElement('span',
                        { className: 'prop' },
                        name &&
                        system.React.createElement('span',
                            { className: `${depth === 1 && 'model-title'} prop-name` },
                            title),
                        system.React.createElement('span', { className: 'prop-type' }, type),
                        format && system.React.createElement('span', { className: 'prop-format' }, '(', format, ')'),
                        properties.size
                        ? properties.entrySeq().map(([key, v]) =>
                            system.React.createElement(Property,
                                {
                                    key: `${key}-${v}`,
                                    propKey: key,
                                    propVal: v,
                                    className: 'prop-details'
                                })
                        )
                        : null,
                        showExtensions && extensions.size
                        ? extensions.entrySeq().map(([key, v]) =>
                            system.React.createElement(Property,
                                {
                                    key: `${key}-${v}`,
                                    propKey: key,
                                    propVal: v,
                                    className: 'prop-details'
                                })
                        )
                        : null,
                        !description ? null : system.React.createElement(Markdown, { source: description }),
                        xml && xml.size
                        ? system.React.createElement('span',
                            null,
                            system.React.createElement('br', null),
                            system.React.createElement('span', { className: 'prop-details' }, 'xml:'),
                            xml.entrySeq().map(([key, v]) =>
                                system.React.createElement(
                                    'span',
                                    { key: `${key}-${v}`, className: 'prop-details' },
                                    system.React.createElement('br', null),
                                    '&nbsp;&nbsp;&nbsp;',
                                    key,
                                    ': ',
                                    String(v)
                                )
                            ).toArray()
                        )
                        : null,
                        enumArray &&
                        system.React.createElement(EnumModel, { value: enumArray, getComponent: getComponent })
                    )
                );

            }
        }
    };
};


function disableAuthorizePlugin() {
    return {
        wrapComponents: {
            authorizeBtn: () => () => null,
            ServersContainer: () => () => null,
            SchemesContainer: () => () => null
        }
    };
};

function hideTopbarPlugin() {
    // this plugin overrides the Topbar component to return nothing
    return {
        components: {
            Topbar: function() { return null }
        }
    };
}

