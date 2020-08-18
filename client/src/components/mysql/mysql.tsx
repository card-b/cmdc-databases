import React, { useState, useEffect } from 'react';
import './mysql.scss';

interface PostForm extends HTMLFormElement {
    field1: HTMLInputElement;
    field1name: HTMLInputElement;
    field2: HTMLInputElement;
    field2name: HTMLInputElement;
    field3: HTMLInputElement;
    field3name: HTMLInputElement;
}

function MySqlInsert(data: any) {
    return fetch('http://localhost:8080/posts/mysql', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json());
}

export default function MySql(props: any) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState<any>(null);

    function getPosts() {
        fetch('http://localhost:8080/posts/mysql').then(async result => {
            if (result.ok) {
                let resultPosts = await result.json();
                setPosts(resultPosts);
            }
        }).catch(e => {
            console.error(e);
            setError(e);
        })
    }

    useEffect(() => {
        getPosts();
    }, []);

    function insertPost(e: React.FormEvent) {
        //don't refresh the page
        e.preventDefault();

        //get form element from event
        const target = e.target as PostForm;

        //create empty object for submission
        const data: any = {};

        //build object from user-set data
        data[target.field1name.value] = target.field1.value;
        data[target.field2name.value] = target.field2.value;
        data[target.field3name.value] = target.field3.value;

        //insert into the database
        MySqlInsert(data).then(result => {
            if (result.error) {
                //show error in <pre> tag, hence the weird formatting here
                setError(`
Error: ${result.error}

Database Returned: ${result.exact_mysql_error}
                `)
            } else {
                setError('');
                getPosts();
                target.reset();
            }
        }).catch(e => {
            console.error(e);
            setError(e.toString())
        });
    }

    return (
        <div className='page-wrapper'>
            <div className="page-left">
                <h1>MySQL Posts</h1>
                {error && (
                    <pre className="error">{error.toString()}</pre>
                )}

                <section className="explainer">
                    <p>The MySQL table for posts has 3 user-editable columns (a.k.a "fields"):</p>
                    <ol>
                        <li>title</li>
                        <li>body</li>
                        <li>user</li>
                    </ol>
                    <p>The remaining fields are automatically generated. They are:</p>
                    <ol>
                        <li>id</li>
                        <li>created</li>
                    </ol>
                    <p>Where "id" is the unique identifier for this row (a.k.a "record") in the table and "created" is the timestamp for the post.</p>
                    <p>Create some posts by inputting the field name and the data you want to insert to create your posts.</p>
                </section>

                <h3>Posts:</h3>
                {posts.map((post: any) => {
                    const { id, title, body, user, created } = post;
                    return (
                        <div key={id} className="post-wrapper">
                            <h2>Title: {title}</h2>
                            <label>Created By: {user}</label>
                            <p>{body}</p>
                        </div>
                    )
                })}
            </div>
            <div className="page-right">
                <form onSubmit={insertPost}>
                    <h2>Create Post Form</h2>
                    <label htmlFor="field1name">Field 1 Name</label>
                    <input name="field1name" type="text" />
                    <label htmlFor="field1">Field 1 Data</label>
                    <input name="field1" type="text" />

                    <label htmlFor="field2name">Field 2 Name</label>
                    <input name="field2name" type="text" />
                    <label htmlFor="field2">Field 2 Data</label>
                    <textarea name="field2"></textarea>

                    <label htmlFor="field3name">Field 3 Name</label>
                    <input name="field3name" type="text" />
                    <label htmlFor="field3">Field 3 Data</label>
                    <input name="field3" type="text" />

                    <input type="submit" value="insert" />
                </form>
            </div>
        </div>
    )
}