const getEnv = () => {
  let env = "dev";
  const { argv } = process;

  const envCmd = argv[2];
  if (envCmd && envCmd.indexOf("--") > -1) {
    env = envCmd.split("--")[1];
  }
  return env;
};

module.exports = getEnv;
