import React from "react";
import UNavbar from "../components/UserComponents/user-main-comp/UNavbar";

const DPAPage = () => {
  return (
    <div>
    <UNavbar/>
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Data Privacy for Library Users
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p className="text-justify leading-relaxed">
          This outlines how Arcadia collects, stores, and protects user
          information in accordance with privacy practices. By using the
          system, users agree to the terms and conditions stated in this
          policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <p className="text-justify leading-relaxed mb-2">
          Personal information such as email issued by the school addresses
          both students and professors for login authentication, transactions
          (book check-in and out, returns, reservations), and optional user
          preferences for system recommendations and customizations.
        </p>
        <p className="font-medium">The system gathers personal information such as:</p>
        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
          <li>Name</li>
          <li>Student Number</li>
          <li>College</li>
          <li>Department</li>
          <li>Email</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Purpose of Data Collection</h2>
        <p className="text-justify leading-relaxed">
          The data collected will be used only for user login and system
          control, managing library transactions and services, and improving
          user experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Your Choices and Obligations
        </h2>
        <p className="text-justify leading-relaxed">
          Users have an option to not share their own data for library purposes
          by continuing as a Guest. By doing so, users may not be able to use
          the best potential of the system.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Data Protection & Security</h2>
        <p className="text-justify leading-relaxed">
          Security measures are implemented to protect user data, including
          encryption of the collected data and restricted access to personal
          data by allowed personnel only.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Data Sharing & Disclosure</h2>
        <p className="text-justify leading-relaxed">
          We do not sell, share, or distribute personal data to third parties
          except when needed by the law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Rights</h2>
        <p className="text-justify leading-relaxed">
          Users have the right to review and gain access to their personal data
          stored in the system. They can request modification or deletion of
          inaccurate information in their account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
        <p className="text-justify leading-relaxed">
          User accounts are retained only as long as necessary for ARC
          operations. Upon graduation, accounts will be changed to an alumni
          account. For faculty exit, personal data will be securely deleted. If
          users wish to come back, they may consult the desk for assistance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Policy Updates</h2>
        <p className="text-justify leading-relaxed mb-4">
          In Lyceum of the Philippines University, we value your privacy and aim
          to uphold the same when processing your personal data.
        </p>

        <p className="text-justify leading-relaxed mb-4">
          For purposes of account registration, we may collect basic information
          about you such as your Name, Student Number, College, Department, and
          LPU-assigned email address.
        </p>

        <p className="text-justify leading-relaxed mb-4">
          We are committed to protecting your personal data from loss, misuse,
          and any unauthorized processing activities, and will take all
          reasonable precautions to safeguard its security and confidentiality.
          Neither will we disclose, share, or transfer the same to any third
          party without your consent.
        </p>

        <p className="text-justify leading-relaxed mb-4">
          Unless you agree to have us retain your personal data for the purposes
          stated above, your data will only be kept for a limited period. As
          soon as the purpose for its use has been achieved, it will be disposed
          of in a safe and secure manner.
        </p>

        <p className="text-justify leading-relaxed mb-4">
          This website is being managed by the Academic Resource Center. To
          contact the website owner, please send an email to:{" "}
          <a
            href="mailto:cav-arc@lpu.edu.ph"
            className="text-blue-600 underline"
          >
            cav-arc@lpu.edu.ph
          </a>
          .
        </p>

        <p className="text-justify leading-relaxed mb-4">
          We recognize your rights with respect to your personal data. Should
          you wish to exercise any of them or if you have any concerns regarding
          our processing activities, you may contact us at{" "}
          <a
            href="mailto:cav-arc@lpu.edu.ph"
            className="text-blue-600 underline"
          >
            cav-arc@lpu.edu.ph
          </a>
          .
        </p>

        <p className="text-justify leading-relaxed">Thank you.</p>
      </section>
    </div>
    </div>
  );
};

export default DPAPage;
