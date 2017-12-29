const dev_config = {
  dockerRegistryUrl: '192.168.32.10:5001'
};

const pro_config = {
  dockerRegistryUrl: 'dockerhub.yonyoucloud.com'
};

let config = pro_config;



if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'location'){
  config = dev_config;
}

export default config;

