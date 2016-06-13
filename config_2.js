module.exports = {
  uKey : 'NmJhZDQ0YzUtOTEzZi00NjE0LWI1ZWUtZWM2YzgyMWM1ZWNk', // Thingplug(https://sandbox.sktiot.com) 로그인 후, `마이페이지`에 있는 사용자 인증키
  nodeID : '12345678901234567890sjw7', // Device 구분을 위한 ID  (본 예제에서는 맨 뒷자리를 핸드폰 번호 사용 권장)
  passCode : '1234', // ThingPlug에 Device등록 시 사용할 Device의 비밀번호 (본 예제에서는 생년월일 사용 권장)
  appID : 'myApplication', //Application의 구분을 위한 ID
  containerName:'LoRa', // starter kit에서 생성하고 사용할 container 이름 (임의지정)
  mgmtCmdPrefix : 'myMGMT', // starter kit에서 생성하고 사용할 제어 명령 이름 접두사 (임의지정)
  DevReset : 'DevReset', // starter kit에서 생성하고 사용할 제어 명령 이름 접두사 (임의지정)
  RepPerChange : 'RepPerChange', // starter kit에서 생성하고 사용할 제어 명령 이름 접두사 (임의지정)
  RepImmediate : 'RepImmediate', // starter kit에서 생성하고 사용할 제어 명령 이름 접두사 (임의지정)
  cmdType : 'sensor_1' // starter kit에서 사용할 제어 타입 (임의지정)
};
