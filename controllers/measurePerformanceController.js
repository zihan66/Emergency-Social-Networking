const normalStrategy = require("../lib/publicMessageStrategy").normalStrategy;
const testStrategy = require("../lib/publicMessageStrategy").testStrategy;
const MessageTest = require("../models/message").MessageTest;
const publicMessageController = require("./publicMessageController");

class measurePerformanceController {
  static async startTest(req, res) {
    if (req.app.locals.inTest) {
      res.status(404).json({ error: "There is an ongoing test" });
      return;
    }
    const { testDuration } = req.body;
    req.app.locals.inTest = true;
    try {
      await MessageTest.deleteMany({});
      publicMessageController.setStrategy(new testStrategy());
      setTimeout(() => {
        measurePerformanceController.resumeNormalOperation(req);
      }, 1000 * (testDuration + 5));
      res.status(200).json({});
    } catch (error) {}
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
    } catch (error) {}
  }
}

module.exports = measurePerformanceController;
