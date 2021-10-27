import React from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";

const QUERY = gql`
query{
  viewer {
    login
    avatarUrl
    bio
    following {
      totalCount
    }
    name
    commitComments {
      totalCount
    }
    repositories {
      totalCount
    }
  }
}
`;

function Home() {
    const { loading, error, data } = useQuery(QUERY);
    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    console.log(data);
    return (
        <div>
            <h1>Home</h1>
            <p>{data.viewer.login}</p>
        </div>

    )
}

export default Home;