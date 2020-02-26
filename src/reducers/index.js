import { combineReducers } from "redux";
import { editTextReducer } from "./editableTextReducer";
import { updateTreeReducer } from "./testCaseCreationTree";
import { testCaseTable } from "./table";
import { videoStream } from "./videoStream";
import { popup } from "./popup";
import { tooltip } from "./tooltip";
import { testCaseExecute } from "./testCaseExecute";
import { testCaseSelect } from "./selectedTestCasesList";
import { dockerList } from "./dockerList";
import { reducer as formReducer } from "redux-form";

export default combineReducers({
  editableText: editTextReducer,
  tree: updateTreeReducer,
  form: formReducer,
  table: testCaseTable,
  popup: popup,
  videoStream: videoStream,
  tooltip: tooltip,
  testCaseExecution: testCaseExecute,
  testCaseSelect: testCaseSelect,
  dockerList: dockerList
});
