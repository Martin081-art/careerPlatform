export const addCourse = async (req, res) => {
  const { institutionId, facultyId, name } = req.body;
  await db.collection("institutions").doc(institutionId)
          .collection("faculties").doc(facultyId)
          .collection("courses").add({ name });
};
