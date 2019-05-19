import React from "react";
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';

const ProfileLoading = () => {
  return (
    <div className="profile-loading flex fc jc ac">
      <Sentry/>
    </div>
  )
}

export default ProfileLoading