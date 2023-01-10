const button = document.querySelector('#button');
const reset = document.querySelector('#reset');
const value = document.querySelector('#value');
const chat = document.querySelector('.chat');

let lengthCharacteristic = null;

button.addEventListener('click', () => {
    navigator.bluetooth.requestDevice({
      filters: [{ name: 'MyESP32' }],
      optionalServices: ['c48e6067-5295-48d3-8d5c-0395f61792b1']
      })
    .then(device => device.gatt.connect())
    .then(server => {
      // Getting Battery Service…
      return server.getPrimaryService('c48e6067-5295-48d3-8d5c-0395f61792b1');
    })
    .then(service => {
      // Getting Battery Level Characteristic…
      return service.getCharacteristic('c48e6067-5295-48d3-8d5c-0395f61792b2');
    })
    .then(characteristic => {
      // Reading Battery Level…
      console.log(characteristic);
      lengthCharacteristic = characteristic;
      return characteristic.startNotifications();
    })
    .then( () => {
      lengthCharacteristic.addEventListener('characteristicvaluechanged', async (event) => {
        console.log(event.target.value.getUint32(0, true));
        value.innerHTML = event.target.value.getUint32(0, true) / 1000;
      })
    })
    .catch(error => { console.error(error); });

})

reset.addEventListener('click', () => {
  console.log(lengthCharacteristic);
  console.log(new Uint32Array([0]));
  console.log(new ArrayBuffer(8));
  console.log(new Int32Array([0]).buffer);
  lengthCharacteristic.writeValueWithoutResponse(new Int32Array([0]).buffer)

})

setTimeout(() => {
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot')
  botMessage.innerHTML= "Wilkommen!<br>Um das Alter eines Baumes zu bestimmen benötige ich einige Informationen. Zuerst muss ich wissen um welche Baumart es sich handelt. Gebe den Namen der Baumart ein."
  chat.appendChild(botMessage);
}, 1000)


