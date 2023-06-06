import logo from '@src/assets/images/logo/logo.png'

const FullSpinner = () => {
  return (
    <div className="fallback-spinner app-loader3">
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

export default FullSpinner
