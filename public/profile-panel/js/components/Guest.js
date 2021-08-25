// console.log("guestContent ready");

const Guest = (props) => {

  return (
    <ul className="guest-options">
      <li><a href="#">ENTREPRENEURS</a></li>
      <li><a href="#">INVESTORS</a></li>
      <li><a href="#">ABOUT</a></li>
      <li className="auth-btn"><a href={`${location.origin}/auth/signup`} >Sign Up</a></li>
      <li className="auth-btn"><a href={`${location.origin}/auth/signin`} >Sign In</a></li>
    </ul>
  );
}

export default Guest;
