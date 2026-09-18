import type { Metadata } from "next";
import PolicyDocument, {
  DataTable,
  type DocSection,
} from "@/components/PolicyDocument";

export const metadata: Metadata = {
  title: "Rokhsati privacy policy",
  description:
    "Privacy policy for Rokhsati, the Moroccan driving licence exam preparation app for Android and iOS. No sign-up, no personal details.",
  alternates: { canonical: "/privacy/rokhsati" },
};

const sections: DocSection[] = [
  {
    id: "on-device",
    title: "Information that stays on your device",
    body: (
      <>
        <p>
          Everything the App records about your studying is written to private
          application storage on your device, which other apps cannot read. None
          of it is transmitted to us. Specifically:
        </p>
        <ul>
          <li>
            <strong>Quiz history</strong> — the exams you have taken, your
            answers, your score, and when you took them, so the App can show
            whether you are improving.
          </li>
          <li>
            <strong>Course progress</strong> — which training axes and chapters
            you have opened and how far through them you are.
          </li>
          <li>
            <strong>Downloaded course content</strong> — lesson text, images,
            and road signs are cached locally so the App works without a
            connection.
          </li>
          <li>
            <strong>Cached lesson video</strong> — driving lesson clips you play
            are kept in a local cache for offline replay.
          </li>
          <li>
            <strong>Your preferences</strong> — your choice of French or Arabic,
            and your notification setting.
          </li>
        </ul>
        <p>
          All of this is removed when you clear the App’s data or uninstall it.
          See <a href="#retention">Retention and deletion</a> below.
        </p>
      </>
    ),
  },
  {
    id: "no-account",
    title: "There is no account, and no sign-up",
    body: (
      <>
        <p>
          The App does not ask you to register. It does not collect your name,
          email address, telephone number, postal address, date of birth,
          photograph, or any government or licence identifier.
        </p>
        <p>
          So that the App can download lesson content securely, it signs in to
          Firebase <strong>anonymously</strong> in the background the first time
          it runs. This produces a random identifier for your installation. It
          is not tied to you, to any email address, or to any account you hold
          elsewhere, and it cannot be used to identify you. It exists only so
          our content servers can tell one installation from another and refuse
          unauthorised requests. Clearing the App’s data or reinstalling
          produces a new identifier.
        </p>
      </>
    ),
  },
  {
    id: "automatic",
    title: "Information collected automatically",
    body: (
      <>
        <p>
          The App includes services from Google that collect data in the
          background. We see these only as aggregated reports; they are not
          linked to your name or to any account.
        </p>
        <DataTable
          caption="Third-party services in Rokhsati, what each collects, and why"
          rows={[
            {
              service: "Google Analytics for Firebase",
              collects:
                "App opens and in-app events, session length, device model, operating system version, language, country derived from IP address, and a randomly generated app instance identifier",
              why: "To understand which lessons and quizzes are used, and where learners get stuck",
            },
            {
              service: "Firebase Crashlytics",
              collects:
                "Crash and error reports, including the stack trace, device model, operating system version, and App state at the moment of the crash",
              why: "To diagnose and fix crashes",
            },
            {
              service: "Firebase Cloud Messaging",
              collects: "A push notification token identifying your installation",
              why: "To deliver study reminders and announcements, where you have allowed them",
            },
            {
              service: "Firebase Authentication",
              collects: "An anonymous user identifier, and the date it was created",
              why: "To authorise downloads of lesson content, as described above",
            },
            {
              service: "Google AdMob",
              collects:
                "Advertising ID, IP address, ad impressions and interactions, and general device information",
              why: "To display advertising, which funds the App",
            },
          ]}
        />
        <p>
          Google processes this data as described in the{" "}
          <a
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Privacy Policy
          </a>
          . Further detail is available for{" "}
          <a
            href="https://firebase.google.com/support/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Firebase
          </a>{" "}
          and for{" "}
          <a
            href="https://support.google.com/admob/answer/6128543"
            rel="noopener noreferrer"
            target="_blank"
          >
            AdMob
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "advertising",
    title: "Advertising and your choices",
    body: (
      <>
        <p>
          The App is free and is funded by advertising supplied by Google AdMob.
          Adverts appear between lessons and around quiz results. Advertisers do
          not receive your quiz answers, your scores, or anything else you do
          inside the App.
        </p>
        <p>
          Android and iOS both let you limit what advertisers learn about you,
          independently of this App. On Android, open{" "}
          <strong>Settings → Privacy → Ads</strong> to delete or reset your
          advertising identifier or to opt out of personalised advertising. On
          iOS, open <strong>Settings → Privacy &amp; Security → Tracking</strong>{" "}
          to refuse tracking permission. Doing so does not remove advertising,
          but it stops it being personalised.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Content we send to your device",
    body: (
      <>
        <p>
          Lesson text, images, road signs, and video are downloaded from Cloud
          Firestore and Firebase Storage when the App checks for updated
          material. This traffic runs in one direction: the App reads what we
          publish.{" "}
          <strong>
            It does not write your progress, your answers, or any other personal
            data back to those services.
          </strong>
        </p>
        <p>
          Making those requests necessarily discloses your device’s IP address
          to Google, as any network request does. We do not keep server-side
          logs that associate an IP address with a learner.
        </p>
      </>
    ),
  },
  {
    id: "notifications",
    title: "Notifications",
    body: (
      <p>
        If you allow it, the App sends occasional study reminders, exam tips,
        and announcements through Firebase Cloud Messaging. Android 13 and
        later, and iOS, ask for your permission before the first notification is
        shown, and you may refuse. You can withdraw permission at any time in
        your device settings, and the App continues to work without it.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Retention and deletion",
    body: (
      <>
        <p>
          Everything held on your device stays there until you remove it. You
          can clear all of it through{" "}
          <strong>
            Android Settings → Apps → Rokhsati → Storage → Clear data
          </strong>
          , by deleting the App on iOS, or by uninstalling it on either
          platform. Uninstalling also discards the anonymous identifier
          described above.
        </p>
        <p>
          Analytics and crash data held by Google are retained according to
          Google’s own schedules, which for Firebase Analytics defaults to 14
          months. To have data associated with your installation deleted from
          those systems, contact us at the address below and include the date
          and approximate time of use, since we hold no identifier that would
          let us find you otherwise.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The App prepares candidates for a driving licence and is intended for
        people old enough to sit that examination. It is not directed at
        children under 13, and we do not knowingly collect personal information
        from them. If you believe a child has provided us with personal
        information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          The App’s data is stored in private application storage that other
          apps cannot access. All communication with our content services and
          with Google is over encrypted HTTPS connections.
        </p>
        <p>
          No system is perfectly secure, but the exposure here is deliberately
          small: because the App holds no account, no contact details, and no
          payment information, there is no store of personal data about you for
          anyone to obtain from us.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access,
          correct, delete, or port your personal data, to object to or restrict
          its processing, and to withdraw consent. Residents of Morocco hold
          these rights under Law 09-08 on the protection of individuals with
          regard to the processing of personal data, supervised by the CNDP.
          Residents of the European Economic Area and the United Kingdom hold
          comparable rights under the GDPR, and residents of California under
          the CCPA, including the right not to be discriminated against for
          exercising them. We do not sell personal information.
        </p>
        <p>
          Because the App has no accounts, almost nothing reaches us, and what
          does is not linked to your identity. To exercise any of these rights,
          or to complain to a supervisory authority, use the contact address
          below.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as the App changes. The effective date at the
        top will be revised, and material changes will be signalled in the App
        or on its store listing. Continuing to use the App after a change means
        you accept the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy or about your data can be sent to{" "}
        <a href="mailto:leetfolks@gmail.com">leetfolks@gmail.com</a>.
      </p>
    ),
  },
];

export default function RokhsatiPrivacy() {
  return (
    <PolicyDocument
      slug="rokhsati"
      sections={sections}
      meta={{
        kind: "Rokhsati, on Google Play",
        title: "Rokhsati",
        nativeTitle: "رخصتي",
        icon: "/apps/rokhsati-icon.png",
        effective: "18 September 2026",
        updated: "18 September 2026",
        facts: [
          { label: "Package", value: "com.leetfolks.rokhsati" },
          { label: "Platforms", value: "Android · iOS" },
        ],
        intro: (
          <p>
            This policy explains what the Rokhsati mobile application (package{" "}
            <code>com.leetfolks.rokhsati</code>, the “App”) does with
            information when you use it on Android or iOS. The App is published
            by Leet Folks (“we”, “us”).
          </p>
        ),
        summary: (
          <>
            <p>
              Rokhsati is a study app for the Moroccan driving licence theory
              exam. There is no sign-up, and we never ask for your name, email,
              or phone number.
            </p>
            <p>
              Your lessons read, quiz answers, scores, and history are stored{" "}
              <strong>only on your device</strong>. We do not upload them and we
              cannot see them.
            </p>
            <p>
              The App does send anonymous usage statistics, crash reports, and
              advertising data to Google. That is the only information that
              leaves your device to us or our providers.
            </p>
          </>
        ),
        note: (
          <p>
            Rokhsati is published by Leet Folks. This policy covers the Rokhsati
            mobile application only, and does not cover any third-party service
            you reach through it.
          </p>
        ),
      }}
    />
  );
}
