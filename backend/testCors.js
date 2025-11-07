import fetch from "node-fetch"; // or native fetch if using Node 18+

fetch("https://careerplatform-o67g.onrender.com/cors-test")
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
