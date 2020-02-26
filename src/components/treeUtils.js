import tree from "../apis/testCaseCreationTree.js";
import { getNodeAtPath } from "react-sortable-tree";

export const item_types = {
  app: { name: "app", child: "test_suite", parent: null, isFolder: true },
  test_suite: {
    name: "test_suite",
    child: "test_case",
    parent: "app",
    isFolder: true
  },
  test_case: {
    name: "test_case",
    child: null,
    parent: "test_suite",
    isFolder: false
  }
};

export const getApps = () => {
  return tree.get(`/apps`);
};

export const getTestSuites = appId => {
  return tree.get(`/test-suites/${appId}`);
};

export const postTestSuite = testSuiteData => {
  return tree.put(
    `/test-suite/${testSuiteData["testSuite"].id}`,
    testSuiteData,
    {
      "Content-Type": "application/json"
    }
  );
};

export const deleteTestSuite = id => {
  return tree.delete(`/test-suite/${id}`);
};

export const getTestCases = testSuiteId => {
  return tree.get(`/test-cases/${testSuiteId}`);
};

export const getTestCase = testCaseId => {
  return tree.get(`/test-case/${testCaseId}`);
};

export const postTestCase = testCaseData => {
  return tree.put(`/test-case/${testCaseData["testCase"].id}`, testCaseData, {
    "Content-Type": "application/json"
  });
};

export const deleteTestCase = id => {
  return tree.delete(`/test-case/${id}`);
};

export const mapTestCasesToTreeData = async () => {
  const response = await getApps();

  const allApps = response.data.apps;

  let treeData = [];

  for (var a in allApps) {
    var app = allApps[a];
    treeData.push({
      title: app.name,
      attributes: item_types.app,
      id: app.id,
      parentId: null,
      expanded: true,
      children: await (async appId => {
        var children = [];
        let testSuites = await getTestSuites(appId);
        testSuites = testSuites.data.testSuites;
        for (var s in testSuites) {
          var ts = testSuites[s];
          children.push({
            title: ts.name,
            attributes: item_types.test_suite,
            id: ts.id,
            parentId: ts.parentId,
            expanded: true,
            children: await (async testSuiteId => {
              let testCases = await getTestCases(testSuiteId);
              testCases = testCases.data.testCases;
              var children = [];
              for (var c in testCases) {
                var tc = testCases[c];
                children.push({
                  title: tc.name,
                  attributes: item_types.test_case,
                  id: tc.id,
                  parentId: tc.parentId
                });
              }
              return children;
            })(ts.id)
          });
        }
        return children;
      })(app.id)
    });
  }
  return treeData;
};

export const getParentNode = (node, getNodeKey, path, treeData) => {
  var newPath = [...path];
  newPath.splice(-1, 1);
  var parentPath = newPath;
  return getNodeAtPath({
    treeData,
    getNodeKey,
    path: parentPath
  }).node;
};
