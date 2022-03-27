const normalStrategy = require("../lib/publicMessageStrategy").normalStrategy;
const testStrategy = require("../lib/publicMessageStrategy").testStrategy;
const publicMessageController = require("./publicMessageController");

class measurePerformanceController {
  static startTest(req, res) {
    if (req.app.locals.inTest) {
      res.status(404).json({ error: "There is an ongoing test" });
    }
    const { testDuration } = req.body;
    req.app.locals.inTest = true;
    try {
      publicMessageController.setStrategy(new testStrategy());
      setTimeout(() => {
        measurePerformanceController.resumeNormalOperation(req);
      }, 1000 * testDuration);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }

  static resumeNormalOperation(req) {
    if (req.app.locals.inTest === false) {
      return;
    }
    req.app.locals.inTest = false;
    publicMessageController.setStrategy(new normalStrategy());
  }

  static stopTest(req, res) {
    try {
      measurePerformanceController.resumeNormalOperation(req);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(500).json({});
    }
  }
}

module.exports = measurePerformanceController;
