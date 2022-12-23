import mjml2html from 'mjml';

interface TemplateParams {
  email: string;
  link: string;
  userAgent: {
    browser?: string;
    os?: string;
    device?: string;
  };
}

const mjmlTemplate = ({ email, link, userAgent }: TemplateParams) =>
  `<mjml>
  <mj-head>
    <mj-font name="Readex Pro" href="https://fonts.googleapis.com/css2?family=Readex+Pro" />
  </mj-head>

  <mj-body width="500px">

    <mj-section padding="20px">
    </mj-section>

    <mj-wrapper padding="10px" background-color="#FAF7FD" border-radius="12px">
      <mj-section>
        <mj-column>

          <mj-image width="30px" padding-bottom="20px" src="https://upload.wikimedia.org/wikipedia/fr/thumb/e/e9/Logo_Stade_Rennais_FC.svg/1200px-Logo_Stade_Rennais_FC.svg.png" />

          <mj-text font-family="Readex Pro, system-ui, Helvetica, Arial, sans-serif" font-size="24px" align="center">Sign in to Prevezic</mj-text>

          <mj-text font-family="Readex Pro, system-ui, Helvetica, Arial, sans-serif" font-size="14px" padding-top="20px" padding-bottom="30px" line-height="20px" align="center">
            You requested a link to quickly signing in to Prevezic. Click the button below to confirm it. This link will expire in 10 minutes.
          </mj-text>

          <mj-button font-family="Readex Pro, system-ui, Helvetica, Arial, sans-serif" border-radius="8px" background-color="#6253A6" font-size="14px" padding-bottom="30px" align="center" inner-padding="12px 25px" height="30px" href="${link}">Sign in to Prevezic</mj-button>

          <mj-text font-family="Readex Pro, system-ui, Helvetica, Arial, sans-serif" color="#848484" font-size="12px" line-height="20px" align="center" padding-bottom="0px" padding-top="0px">
            You will be signed in with ${email} by confirming this request.
          </mj-text>

        </mj-column>
      </mj-section>

      ${
        userAgent.browser || userAgent.os || userAgent.device
          ? `
      <mj-section padding="10px">
        <mj-column background-color="#F2ECF9" border-radius="8px">
          <mj-text font-family="Readex Pro, system-ui, Helvetica, Arial, sans-serif" align="center" color="#848484" font-size="12px" line-height="20px">Requested from <b>${
            userAgent.os
          }</b>${userAgent.device ? ` (<b>${userAgent.device}</b>)` : ''} using <b>${userAgent.browser}</b></mj-text>
        </mj-column>
      </mj-section>`
          : ``
      }

    </mj-wrapper>

    <mj-section padding-bottom="20px">
    </mj-section>
  </mj-body>
</mjml>`;

export function getEmailHtml(params: TemplateParams) {
  return mjml2html(mjmlTemplate(params)).html;
}
