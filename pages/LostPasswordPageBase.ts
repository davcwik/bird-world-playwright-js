import { expect, test, type Locator, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';
import { fillSecret } from '../utils/SecureActions';


export class LostPasswordPageBase {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly getNewPasswordButton: Locator;
  private readonly loginPageLink: Locator;
  private readonly lostPasswordFormContainer: Locator;
  private readonly notificationMessageTextBlock: Locator;
  private readonly page: Page;
  private readonly usernameEmailAddressInput: Locator;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.getNewPasswordButton = page.getByRole('button', { name: 'Get New Password' })
    this.loginPageLink = page.getByRole('link', { name: 'login page' });
    this.lostPasswordFormContainer = page.locator('#lostpasswordform');
    this.notificationMessageTextBlock = page.locator("div.notice-info > p");
    this.page = page;
    this.usernameEmailAddressInput = page.getByRole('textbox', { name: 'Username or Email Address' })
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
      await expect(this.lostPasswordFormContainer).toBeVisible();
    });  
  }

  async expectNotificationMessageTextToBeVisible(text: string): Promise<void> {
    await test.step(`Verify notification message text is visible: ${text}`, async () => {
      await expect(this.notificationMessageTextBlock.getByText(text)).toBeVisible();
    });  
  }

    /**
   * Input text in Username Email Address input field (fillSecret will mask text in logs)
   * @param text - text to input
   */
  async inputTextInLostPasswordForm(text: string): Promise<void> {
    const username = EnvFileReader.getProperty(text);
    await fillSecret(this.usernameEmailAddressInput, username);
  }  

  async clickGetNewPasswordButton(): Promise<void> {
    await test.step(`Click Get New Password button`, async () => {
      await this.getNewPasswordButton.click();
    });    
  }   

  async clickLoginPageLink(): Promise<void> {
    await test.step(`Click Login Page link`, async () => {
      await this.loginPageLink.click();
    });    
  }  


}