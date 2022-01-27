#### To reproduce
```bash
git clone https://github.com/handlebauer/arlocal-issue-63.git

cd arlocal-issue-63
npm i
npm run test
```
`./src/test.js` has one test: `arweave.getData() should return data matching that of the data uploaded`