
function renderAuths() {
    return {
        wrapComponents: {
            auths: (OriginalComponent, system) => (props) => {

                const { definitions, getComponent, authSelectors, errSelectors } = props;
                const AuthItem = getComponent('AuthItem');
                const Oauth2 = getComponent('oauth2', true);
                const Button = getComponent('Button');

                const authorized = authSelectors.authorized();

                const authorizedAuth = definitions.filter((definition, key) => {
                    return !!authorized.get(key);
                });

                const nonOauthDefinitions = definitions.filter(
                    schema => schema.get('type') !== 'oauth2'
                );
                const oauthDefinitions = definitions.filter(
                    schema => schema.get('type') === 'oauth2'
                );

                const httpSchemaDefinitions = definitions.filter(
                    schema => schema.get('type') === 'http'
                );

                return system.React.createElement('div', { className: 'auth-container' },
                    !!nonOauthDefinitions.size
                    && system.React.createElement('form', { onSubmit: OriginalComponent.submitAuth },
                        nonOauthDefinitions.map((schema, name) => {
                            return system.React.createElement(AuthItem, {
                                key: name,
                                schema: schema,
                                name: name,
                                getComponent: getComponent,
                                onAuthChange: OriginalComponent.onAuthChange,
                                authorized: authorized,
                                errSelectors: errSelectors
                            });
                        })
                        .toArray(),

                        !httpSchemaDefinitions.size && system.React.createElement('div', { className: 'auth-btn-wrapper' },
                            nonOauthDefinitions.size === authorizedAuth.size
                            ? system.React.createElement(Button, 
                                {
                                    className: 'btn modal-btn auth',
                                    onClick: OriginalComponent.logoutClick
                                },
                                'Logout'
                            )
                            : system.React.createElement(Button,
                                { type: 'submit', className: 'btn modal-btn auth authorize' },
                                'Authorize'
                            ),
                            system.React.createElement(Button,
                                { className: 'btn modal-btn auth btn-done', onClick: OriginalComponent.close },
                                'Close'
                            )
                        )
                    ),
                    oauthDefinitions && oauthDefinitions.size
                    ? system.React.createElement('div', null,
                        system.React.createElement('div', { className: 'scope-def' },
                            system.React.createElement('p', null,
                                'Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.'
                            ),
                            system.React.createElement('p', null,
                                'API requires the following scopes. Select which ones you want to grant to Swagger UI.'
                            )
                        ),
                        definitions
                        .filter(schema => schema.get('type') === 'oauth2')
                        .map((schema, name) => {
                            return system.React.createElement('div',
                                { key: name },
                                system.React.createElement(Oauth2, {
                                    authorized: authorized,
                                    schema: schema,
                                    name: name
                                })
                            );
                        })
                        .toArray()
                    )
                    : null
                );
            }
        }
    };
};


function renderHttpAuth() {
    return {
        wrapComponents: {
            HttpAuth: (OriginalComponent, system) => (props) => {

                let { schema, getComponent, errSelectors, name } = props;

                const Input = getComponent('Input');
                const Row = getComponent('Row');
                const Col = getComponent('Col');
                const AuthError = getComponent('authError');
                const Markdown = getComponent('Markdown');
                const JumpToPath = getComponent('JumpToPath', true);

                const scheme = (schema.get('scheme') || '').toLowerCase();
                let value = null; // props.getValue();
                let errors = errSelectors
                    .allErrors()
                    .filter(err => err.get('authId') === name);

                if (scheme === 'basic') {
                    let username = value ? value.get('username') : null;
                    return system.React.createElement('div', null,
                        system.React.createElement('h4', null, system.React.createElement('code', null, name || schema.get('name')),
                            '\xA0 (http, Basic)',
                            system.React.createElement(JumpToPath,
                                {
                                    path: ['securityDefinitions', name]
                                })
                        ),
                        username && system.React.createElement('h6', null, 'Authorized'),
                        system.React.createElement(Row, null,
                            system.React.createElement(Markdown, { source: schema.get('description') })
                        ),
                        system.React.createElement(Row, null,
                            system.React.createElement('label', null, 'Username:'),
                            username
                                ? system.React.createElement('code', null, ' ', username, ' ')
                                : system.React.createElement(Col, null,
                                    system.React.createElement(Input,
                                        {
                                            type: 'text',
                                            required: 'required',
                                            name: 'username',
                                            onChange: onChange
                                        })
                                )
                        ),
                        system.React.createElement(Row, null,
                            system.React.createElement('label', null, 'Password:'),
                            username
                                ? system.React.createElement('code', null, ' ****** ')
                                : system.React.createElement(Col, null,
                                    system.React.createElement(Input,
                                        {
                                            required: 'required',
                                            autoComplete: 'new-password',
                                            name: 'password',
                                            type: 'password',
                                            onChange: onChange
                                        })
                                )
                        ),
                        errors.valueSeq().map((error, key) => {
                            return system.React.createElement(AuthError,
                                {
                                    error: error,
                                    key: key
                                });
                        })
                    );
                }

                if (scheme === 'bearer') {
                    return system.React.createElement('div', null,
                        system.React.createElement('h4', null,
                            system.React.createElement('code', null, name || schema.get('name')),
                            '\xA0 (http, Emby)',
                            system.React.createElement(JumpToPath,
                                {
                                    path: ['securityDefinitions', name]
                                })
                        ),
                        value && system.React.createElement('h6', null, 'Authorized'),
                        //system.React.createElement(Row, null,
                        //    system.React.createElement('p', null, 'Authorize-Format: ',

                        //        system.React.createElement('span', null, schema.get('bearerFormat')))
                        //),
                        system.React.createElement(Row, null,
                            system.React.createElement(Markdown, { source: schema.get('description') })
                        ),
                        //system.React.createElement(Row, null,
                        //    system.React.createElement('label', null, 'Value:'),
                        //    value
                        //    ? system.React.createElement('code', null, ' ****** ')
                        //    : system.React.createElement(Col, null,
                        //        system.React.createElement(Input,
                        //            {
                        //                type: 'text',
                        //                onChange: onChange
                        //            })
                        //    )
                        //),
                        errors.valueSeq().map((error, key) => {
                            return system.React.createElement(AuthError,
                                {
                                    error: error,
                                    key: key
                                });
                        })
                    );
                }
                return system.React.createElement('div', null,
                    system.React.createElement('em', null,
                        system.React.createElement('b', null, name),
                        ' HTTP authentication: unsupported scheme ',
                        `'${scheme}'`
                    )
                );
            }
        }
    };
};

