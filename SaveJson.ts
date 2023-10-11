// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.JsonAsset)
    jsonAsset: cc.JsonAsset = null

    @property({ readonly: true })
    url = 'http://localhost:3000'

    start() {
        this.scheduleOnce(() => {
            this.jsonAsset.json.aaa++
            this.save(this.jsonAsset)
        }, 3)
    }

    save(jsonAsset: cc.JsonAsset) {
        fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cmd: 'save',
                // @ts-ignore
                uuid: jsonAsset._uuid,
                data: jsonAsset.json
            })
        }).then(response =>
            response.text()
        ).then(data => {
            console.log(data)
        }).catch(error => {
            console.error(error)
        })
    }
}
