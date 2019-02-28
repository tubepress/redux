export default (type) => {

  const actionCreator = (payload) => ({
    type,
    payload,
  });

  actionCreator.toString = () => `${type}`;
  actionCreator.type     = type;

  return actionCreator;
}