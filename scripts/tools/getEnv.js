const getEnv = () => {
  let env = "dev";
  const { argv } = process;

  const envCmd = argv[2];
  console.log(envCmd);
  if (envCmd && envCmd.indexOf("--") > -1) {
    env = envCmd.split("--")[1];
  }
  console.log(env);
  return env;
};

module.exports = getEnv;
