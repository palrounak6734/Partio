const indexer = 'https://indexer.preprod.midnight.network/api/v4/graphql';

async function main() {
  const res = await fetch(indexer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        __type(name: "Query") {
          fields {
            name
          }
        }
      }`,
    }),
  });

  const data = await res.json();
  const fields = data?.data?.__type?.fields?.map(f => f.name);
  console.log('Available Query fields on Preprod Indexer:', fields);
}

main().catch(console.error);
