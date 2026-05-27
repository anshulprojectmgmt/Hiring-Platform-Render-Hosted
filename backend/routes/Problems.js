const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
{
  /*
  new ObjectId('66089589338be786d245c01a'),
  new ObjectId('660895a1338be786d245c045'),
  new ObjectId('660895a1338be786d245c033'),// samp
  */
}
let idsArray = [
  new ObjectId("660895a1338be786d245c032"), // org

  new ObjectId("6716500c41f91b12fda1ccec"), // org
  new ObjectId("67164bd141f91b12fda1ccea"), // org
  new ObjectId("66089589338be786d245c01a"),
  new ObjectId("660895a1338be786d245c045"),
  new ObjectId("66089589338be786d245c022"),
];

// Sample subjective question IDs (replace with actual IDs from your database)
let subjIds = [
  // new ObjectId('66e1482b7c62462198bcd2b0'),
  // new ObjectId('66e2912142fefec820956b5b'),
  new ObjectId("67fcea9c9219df29ed76f7a7"),
  new ObjectId("67fceb4c9219df29ed76f7a8"),
  new ObjectId("67fcec279219df29ed76f7a9"),
];

router.post("/questions", async (req, res) => {
  const {
    testtype,
    language,
    difficulty,
    questions,
    codQue,
    subjQue,
    mcqQue,
    testCode,
  } = req.body;

  try {
    if (testtype === "coding") {
      if (language === "Python") {
        if (testCode === "SKY3ryBUHZkUN2D") {
          idsArray = [new ObjectId("660895a1338be786d245c033")];
        } else {
          idsArray = [
            new ObjectId("660895a1338be786d245c032"), // org

            new ObjectId("6716500c41f91b12fda1ccec"), // org
            new ObjectId("67164bd141f91b12fda1ccea"), // org
            new ObjectId("660895a1338be786d245c045"),
            new ObjectId("66089589338be786d245c01a"),
            new ObjectId("66089589338be786d245c022"),
          ];
        }
        console.log("idsArray after : ", idsArray);
        var problems;
        switch (difficulty) {
          // logic to attach wrapper
          // code to each problem need to implement here
          case "easy":
            problems = await mongoose.connection
              .collection("pythoneasy")
              .aggregate([
                { $match: { _id: { $in: idsArray } } },
                {
                  $lookup: {
                    from: "wrapper_map",
                    let: { input_type_local: "$input_type" }, // local field
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$title", "$$input_type_local"] }, // match title
                              { $eq: ["$language", language] }, // match language passed
                            ],
                          },
                        },
                      },
                    ],
                    as: "wrapper_details",
                  },
                },
              ])
              .toArray();

            break;
          case "medium":
            problems = await mongoose.connection
              .collection("pythonmedium")
              .aggregate([{ $sample: { size: questions } }])
              .toArray();
            break;
          case "hard":
            problems = await mongoose.connection
              .collection("pythonhard")
              .aggregate([{ $sample: { size: questions } }])
              .toArray();
            break;
          default:
            problems = await mongoose.connection
              .collection("pythoneasy")
              .aggregate([{ $sample: { size: questions } }])
              .toArray();
            break;
        }
        res.json({ success: true, que: problems });
      } else if (language === "Javascript") {
        if (testCode === "SKY3ryBUHZkUN2D") {
          idsArray = [new ObjectId("660895a1338be786d245c033")];
        } else {
          idsArray = [
            new ObjectId("68ec8f73407bf87f27e2f1d9"), // org
            new ObjectId("68ec8fba407bf87f27e2f1dc"), // org
            new ObjectId("69031a3aed02a11ea8b2099d"),
          ];
        }

        var problems;
        switch (difficulty) {
          // logic to attach wrapper
          // code to each problem need to implement here
          case "easy":
            problems = await mongoose.connection
              .collection("javascripteasy")
              .aggregate([
                { $match: { _id: { $in: idsArray } } },
                {
                  $lookup: {
                    from: "wrapper_map",
                    let: { input_type_local: "$input_type" }, // local field
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$title", "$$input_type_local"] }, // match title
                              { $eq: ["$language", language] }, // match language passed
                            ],
                          },
                        },
                      },
                    ],
                    as: "wrapper_details",
                  },
                },
              ])
              .toArray();

            break;
          case "medium":
            problems = await mongoose.connection
              .collection("pythonmedium")
              .aggregate([{ $sample: { size: questions } }])
              .toArray();
            break;
          case "hard":
            problems = await mongoose.connection
              .collection("pythonhard")
              .aggregate([{ $sample: { size: questions } }])
              .toArray();
            break;
          default:
            problems = await mongoose.connection
              .collection("pythoneasy")
              .aggregate([{ $sample: { size: questions } }])
              .toArray();
            break;
        }
        res.json({ success: true, que: problems });
      } else {
        res.json({ que: "no language matched " });
      }
    } else if (testtype === "mcq") {
      var problems = await mongoose.connection
        .collection("mcqeasy")
        .find({})
        .limit(questions)
        .toArray();

      res.json({ success: true, que: problems });
    } else if (testtype === "subjective") {
      // replace sample test ID  here
      if (testCode === "oM35Gz1Wh1w2VQB") {
        subjIds = [new ObjectId("6a1698f4f1f2ae9bf920bdc0")];
      } else {
        subjIds = [
          new ObjectId("689c1e34304c58ea1704005a"),
          new ObjectId("689c1e5b304c58ea1704005b"),
          new ObjectId("689c1e67304c58ea1704005c"),
          new ObjectId("690f218da30abf930f77d9bd"),
        ];
      }

      try {
        var problems = await mongoose.connection
          .collection("subjective_question")
          .aggregate([{ $match: { _id: { $in: subjIds } } }])
          .toArray();
        res.json({ success: true, que: problems });
      } catch (error) {
        console.log("failed to receive subjective questions=", error);
        res.status(500).json({
          success: false,
          message: "Failed to receive subjective questions",
        });
      }
    } else if (testtype === "coding+subjective") {
      let problems = [];
      let codProblems = [];
      let subjProblems = [];
      try {
        // coding Problems
        if (language === "Python") {
          switch (difficulty) {
            // logic to attach wrapper
            // code to each problem need to implement here
            case "easy":
              codProblems = await mongoose.connection
                .collection("pythoneasy")
                .aggregate([
                  { $match: { _id: { $in: idsArray } } },
                  {
                    $lookup: {
                      from: "wrapper_map",
                      localField: "input_type",
                      foreignField: "title",
                      as: "wrapper_details",
                    },
                  },
                ])
                .toArray();
              break;
            case "medium":
              codProblems = await mongoose.connection
                .collection("pythonmedium")
                .aggregate([{ $sample: { size: questions } }])
                .toArray();
              break;
            case "hard":
              codProblems = await mongoose.connection
                .collection("pythonhard")
                .aggregate([{ $sample: { size: questions } }])
                .toArray();
              break;
            default:
              codProblems = await mongoose.connection
                .collection("pythoneasy")
                .aggregate([{ $sample: { size: questions } }])
                .toArray();
              break;
          }
        } else {
          res.status(400).json({ que: "no language matched " });
        }

        // subjective Problems
        subjProblems = await mongoose.connection
          .collection("subjective_question")
          .aggregate([{ $match: { _id: { $in: subjIds } } }])
          .toArray();

        problems = [...subjProblems, ...codProblems];
        res.json({ success: true, que: problems });
      } catch (error) {
        console.log("failed to receive questions=", error);
      }
    } else {
      res.json({ success: false, message: "no test type matched", testtype });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.get("/wrapper-type", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("wrapper_map");

    const titles = await collection
      .find({}, { projection: { _id: 1, title: 1 } })
      .toArray();

    res.json({ success: true, titles }); // Send titles to the client-side app
  } catch (error) {
    console.error("Error fetching titles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add-coding-question", async (req, res) => {
  const { question, difficulty, input_type, wrapper_id, testcases, testtype } =
    req.body;
  console.log("diff==", difficulty);
  try {
    const collection = mongoose.connection.collection(`python${difficulty}`);

    const newDocument = await collection.insertOne({
      question,
      difficulty,
      input_type,
      wrapper_id,
      testcases,
    });

    console.log("newDocument==", newDocument);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create document" });
  }
});

module.exports = router;
