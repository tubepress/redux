import produce from 'immer';

export default (initialState, actionsMap) => (state = initialState, action = undefined) => produce(state, (draft) => {

  const caseReducer = actionsMap[action.type];

  return caseReducer ? caseReducer(draft, action) : undefined;
});
