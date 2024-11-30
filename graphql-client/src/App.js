import React, { useState } from 'react';
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import client from './ApolloClient';

const GET_USER = gql`
    query GetUser($username: String!) {
        getUser(username: $username) {
            username
            description
        }
    }
`;

const ADD_USER = gql`
    mutation AddUser($username: String!, $description: String) {
        addUser(username: $username, description: $description) {
            username
            description
        }
    }
`;

const UPDATE_DESCRIPTION = gql`
    mutation UpdateDescription($username: String!, $description: String!) {
        updateDescription(username: $username, description: $description) {
            username
            description
        }
    }
`;

const App = () => {
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [newUser, setNewUser] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const { data, refetch } = useQuery(GET_USER, {
        variables: { username },
        skip: !username,
    });

    const [addUser] = useMutation(ADD_USER);
    const [updateDescription] = useMutation(UPDATE_DESCRIPTION);

    return (
        <ApolloProvider client={client}>
            <div style={{ padding: '20px' }}>
                <h1>GraphQL ReactJS Service</h1>

                {/* Query User */}
                <div>
                    <h2>Get User Info</h2>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={() => refetch()}>Fetch User</button>
                    {data && data.getUser && (
                        <div>
                            <p>Username: {data.getUser.username}</p>
                            <p>Description: {data.getUser.description}</p>
                        </div>
                    )}
                </div>

                {/* Add User */}
                <div>
                    <h2>Add User</h2>
                    <input
                        type="text"
                        placeholder="New username"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button
                        onClick={() =>
                            addUser({ variables: { username: newUser, description: newDescription } })
                        }
                    >
                        Add User
                    </button>
                </div>

                {/* Update Description */}
                <div>
                    <h2>Update Description</h2>
                    <input
                        type="text"
                        placeholder="Existing username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        onClick={() =>
                            updateDescription({ variables: { username, description } })
                        }
                    >
                        Update Description
                    </button>
                </div>
            </div>
        </ApolloProvider>
    );
};

export default App;
