const _assetlinks : string = `[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target" : { 
      "namespace": "android_app", 
      "package_name": "io.nfttown.community.dev",
      "sha256_cert_fingerprints": 
      ["c5:62:04:c3:eb:69:5a:28:77:f7:93:cc:bb:86:a4:3b:b8:9f:2b:3f:69:9e:1e:ad:80:a1:d2:9a:c4:18:90:1b"] 
  }
}]`



interface AssetLinksProps {}


function AssetLinks(props: AssetLinksProps) {
  return (
    <div >{_assetlinks}</div>
  );
}

namespace AssetLinks {}

export default AssetLinks;