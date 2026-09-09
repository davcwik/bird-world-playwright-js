import { expect, test, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';
import { fillSecret } from '../utils/SecureActions';


export class LostPasswordPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly page: Page;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.page = page;
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLostPasswordPage(): Promise<void> {
    await test.step(`Go to Lost Password Page`, async () => {
      await this.page.goto('/wp-login.php?action=lostpassword');
    });     
  }

  async expectLostPasswordPageToBeVisible(): Promise<void> {
    await test.step(`Verify Lost Password Page is visible`, async () => {
      await this.page.waitForLoadState('networkidle');
      const lostPasswordFormContainer = this.page.locator('#lostpasswordform');
      await expect(lostPasswordFormContainer).toBeVisible();
    });  
  }

  async expectNotificationMessageTextToBeVisible(text: string): Promise<void> {
    await test.step(`Verify notification message text is visible: ${text}`, async () => {
      const notificationMessageTextBlock = this.page.locator("div.notice-info > p");
      await expect(notificationMessageTextBlock.getByText(text)).toBeVisible();
    });  
  }

    /**
   * Input text in Username Email Address input field (fillSecret will mask text in logs)
   * @param text - text to input
   */
  async inputTextInLostPasswordForm(text: string): Promise<void> {
    const username = EnvFileReader.getProperty(text);
    const usernameEmailAddressInput = this.page.getByRole('textbox', { name: 'Username or Email Address' });
    await fillSecret(usernameEmailAddressInput, username);
  }  

  async clickGetNewPasswordButton(): Promise<void> {
    await test.step(`Click Get New Password button`, async () => {
      const getNewPasswordButton = this.page.getByRole('button', { name: 'Get New Password' });
      await getNewPasswordButton.click();
    });    
  }   

  async clickLoginPageLink(): Promise<void> {
    await test.step(`Click Login Page link`, async () => {
      const loginPageLink = this.page.getByRole('link', { name: 'login page' });
      await loginPageLink.click();
    });    
  }  


}