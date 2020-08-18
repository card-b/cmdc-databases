import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';

const exampleJSON = JSON.stringify({
    "some-key": "Some value...",
    'some-other-key': "Some other value..."
}, undefined, 4);

function MongoInsert(data: any) {
    return fetch(`${process.env.REACT_APP_API_HOST}/posts/mongo`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json());
}

export default function Mongo(props: any) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState<any>(null);
    const [code, setCode] = useState(`{}`);
    const codeRef = useRef('{}');

    function getPosts() {
        fetch(`${process.env.REACT_APP_API_HOST}/posts/mongo`).then(async result => {
            if (result.ok) {
                let resultPosts = await result.json();
                setPosts(resultPosts.reverse());
            }
        }).catch(e => {
            console.error(e);
            setError(e);
        })
    }

    useEffect(() => {
        getPosts();
    }, []);

    function submitCode() {
        let json;
        console.log(codeRef.current);
        try {
            json = JSON.parse(codeRef.current);
        } catch (e) {
            setError(`Could not parse code, there may be an error in your syntax.`)
        }

        console.log(json);
        if (json) {
            MongoInsert(json).then(result => {
                if (result.error) {
                    //show error in <pre> tag, hence the weird formatting here
                    setError(`
Error: ${result.error}

Database Returned: ${result.exact_mysql_error}
                `)
                } else {
                    setError('');
                    getPosts();
                    setCode('{}');
                }
            });
        }
    }

    useEffect(() => {
        codeRef.current = code;
    }, [code]);

    return (
        <div className='page-wrapper'>
            <div className="page-left">
                <h1>MongoDB Posts</h1>
                {error && (
                    <pre className="error">{error.toString()}</pre>
                )}

                <section className="explainer">
                    <p>The Mongo database can hold any type of valid JSON data, but what the app will actually render are these three keys:</p>
                    <ol>
                        <li>title</li>
                        <li>body</li>
                        <li>user</li>
                    </ol>
                    <p>Any missing or incorrect fields will do nothing.</p>
                </section>

                <h3>Posts:</h3>
                {posts.reverse().map((post: any) => {
                    console.log(post);
                    const { _id, title, body, user, ...rest } = post;
                    return (
                        <div key={_id} className="post-wrapper">
                            <h2>Title: {title ?? "n/a"}</h2>
                            <label>Created By: {user ?? "n/a"}</label>
                            <p>{body ?? "n/a"}</p>
                            {rest && Object.keys(rest).length > 0 && (
                                <code>
                                    Extra fields present:

                                    {JSON.stringify(rest, undefined, 4)}
                                </code>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="page-right">
                <p>Edit the JSON below to create a post with the correct keys and values.</p>
                <div>Example JSON: <pre>{exampleJSON}</pre></div>
                <Editor
                    value={code}
                    onValueChange={code => setCode(code)}
                    highlight={code => highlight(code, languages.javascript, 'javascript')}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 16,
                        backgroundColor: '#3c3c3c',
                        caretColor: '#eee',
                        color: '#fff'
                    }}
                />
                <button onClick={submitCode}>Submit</button>
            </div>
        </div>
    )
}
