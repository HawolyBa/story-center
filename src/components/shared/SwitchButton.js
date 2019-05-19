import React from 'react'
import Switch from 'react-switch';

const SwitchButton = props => {
  const { checked, switched, text } = props
  return (
    <React.Fragment>
    <span className="switch-label mr-3">{text}</span>
    <label className='switch' htmlFor="material-switch">
      <Switch
        checked={checked}
        onChange={switched}
        onColor="#27bab0"
        onHandleColor="#27bab0"
        handleDiameter={20}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={20}
        width={40}
        className="react-switch"
        id="material-switch"
        uncheckedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 10,
              color: "white",
              paddingRight: 2
            }}
          >
            Off
          </div>
        }
        checkedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 10,
              color: "white",
              paddingRight: 2
            }}
          >
            On
          </div>
        }
      />
    </label>
    </React.Fragment>
  )
}

export default SwitchButton