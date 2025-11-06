export const addFaculty = async (req, res) => {
  const { institutionId, name } = req.body;
  await db.collection("institutions").doc(institutionId).collection("faculties").add({ name });
};
