import logo from '@src/assets/images/logo/logo.png'

const AbsoluteSpinner = () => {
  return (
    <div
      className="fallback-spinner app-loader3"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 11,
        background: 'rgba(0,0,0, 0.03)',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img
        className="fallback-logo"
        src={logo}
        alt="logo"
        style={{ width: '100px', height: '100px' }}
      />
      <div className="loading component-loader my-0">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  )
}

export default AbsoluteSpinner
