import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';
import './redis.scss';

const exampleJSON = JSON.stringify({
    "some-key": "Some value...",
    'some-other-key': "Some other value..."
}, undefined, 4);

function RedisInsert(key: any, value: any) {
    return fetch('http://localhost:8080/posts/redis', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
    })
        .then(result => result.json());
}

export default function Mongo(props: any) {
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);
    const [code, setCode] = useState(`{}`);
    const codeRef = useRef('{}');
    const keyInput = useRef<HTMLInputElement | null>(null);

    function getPosts() {
        fetch('http://localhost:8080/posts/redis').then(async result => {
            if (result.ok) {
                let resultPosts = await result.json();

                let postArray = resultPosts.map((_post: any) => {
                    let post: any = {};
                    try {
                        //we have no idea what string redis holds for this value - try to parse it.
                        //if it can't be parsed, show the error and the original string
                        let validPost = JSON.parse(_post);
                        post.post = validPost;
                        post.error = typeof validPost !== 'object';
                    } catch (e) {
                        console.error(e);
                        post.error = true;
                        post.post = _post;
                    }
                    return post;
                });

                setPosts(postArray);

            }
        });
    }

    useEffect(() => {
        getPosts();
    }, []);

    function submitCode() {
        if (codeRef.current && keyInput.current?.value) {
            RedisInsert(keyInput.current.value, codeRef.current).then(result => {
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
                    keyInput.current!.value = '';
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
                <h1>Redis Posts</h1>
                {error && (
                    <pre className="error">{error.toString()}</pre>
                )}

                <section className="explainer">
                    <p>The Redis database can hold any type of valid JSON data, but like Mongo, what the app will actually render are these three keys:</p>
                    <ol>
                        <li>title</li>
                        <li>body</li>
                        <li>user</li>
                    </ol>
                    <p>Any missing or incorrect fields will do nothing.</p>
                    <p>There's another quirk to Redis - the JSON we insert doesn't have to be valid -
                    it just accepts strings of characters and expects you to be able to do with them whatever you want.</p>
                    <p>It also requires a key as the unique identifier to your data.</p>
                    <p>Since Redis doesn't require valid JSON for an insert, neither does this form. If you format it incorrectly, it's not going to work correctly.</p>
                </section>

                <h3>Posts:</h3>
                {posts.reverse().map((_post: any, index: number) => {
                    const { post, id, error } = _post;
                    let postData;

                    if (!error) {
                        const { id, title, body, user, ...rest } = post;


                        return (
                            <div key={index} className="post-wrapper">
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
                    } else {
                        return (
                            <div key={index} className="post-wrapper error">
                                <label>Post Contains Invalid JSON</label>
                                <pre>{post}</pre>
                            </div>
                        )
                    }

                })}
            </div>
            <div className="page-right">

                <p>Edit the JSON below to create a post with the correct keys and values.</p>
                <div>Example JSON: <pre>{exampleJSON}</pre></div>

                <div className="input-wrapper">
                    <label>Key</label>
                    <input type="text" ref={keyInput} placeholder={'some-key'} />
                </div>

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
