import { expect, test, type Locator, type Page } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';
import { fillSecret } from '../utils/SecureActions';

export class LoginPage {

  ///////////////
  // VARIABLES //
  ///////////////

  private readonly rememberMeTooltip: Locator;
  private readonly page: Page;


  /////////////////
  // CONSTRUCTOR //
  /////////////////

  constructor(page: Page) {
    this.rememberMeTooltip = page.locator('[role="tooltip"]');
    this.page = page;
  }

  
  ///////////////
  // FUNCTIONS //
  ///////////////

  async goToLoginPage(): Promise<void> {
    await test.step(`Go to Login Page`, async () => {
      await this.page.goto('/wp-login.php');
    });      
  }

  async expectLoginPageToBeVisible(): Promise<void> {
    await test.step(`Verify Login Page is visible`, async () => {
      await this.page.waitForLoadState('networkidle');
      const logInFormContainer = this.page.locator('#loginform');
      await expect(logInFormContainer).toBeVisible();
    });    
  }

    /**
   * Input text in Username Email input field (fillSecret will mask text in logs)
   * @param text - text to input
   */
  async inputTextInUsernameEmailField(text: string): Promise<void> {
    const username = EnvFileReader.getProperty(text);
    const usernameEmailInput = this.page.getByRole('textbox', { name: 'Username or Email Address' });
    await fillSecret(usernameEmailInput, username);
  }  

  /**
   * Input text in Password input field (fillSecret will mask text in logs)
   * @param text - text to input
   */
  async inputTextInPasswordField(text: string): Promise<void> {
    const password = EnvFileReader.getProperty(text);
    const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    await fillSecret(passwordInput, password);
  }   

  async expectMessageTextToBeVisible(text: string): Promise<void> {
    await test.step(`Verify message text is visible: ${text}`, async () => {
      const messageTextBlock = this.page.locator("#login-message p");
      await expect(messageTextBlock.getByText(text)).toBeVisible();
    });         
  }

    async expectErrorMessageTextToBeVisible(text: string): Promise<void> {
    await test.step(`Verify message text is visible: ${text}`, async () => {
      const errorMessageTextBlock = this.page.locator("#login_error p");
      await expect(errorMessageTextBlock.getByText(text)).toBeVisible();
    });         
  }

  async clickLogInButton(): Promise<void> {
    await test.step(`Click Log In button`, async () => {
      const logInButton = this.page.getByRole('button', { name: 'Log In' });
      await logInButton.click();
    });    
  }   

  async clickLostYourPasswordLink(): Promise<void> {
    await test.step(`Click Lost Your Password link`, async () => { 
      const lostYourPasswordLink = this.page.getByRole('link', { name: 'Lost your password?' });
      await lostYourPasswordLink.click();
    }); 
  }   

  async clickRememberMeCheckbox(): Promise<void> {
    await test.step(`Click Remember Me checkbox`, async () => {
      const rememberMeCheckbox = this.page.getByRole('checkbox', { name: 'Remember Me' });
      await rememberMeCheckbox.check();
    });
  }

  async clickRememberMeTooltipIcon(): Promise<void> {
    await test.step(`Click Remember Me tooltip icon`, async () => {
      const rememberMeTooltipIcon = this.page.getByRole('button', { name: 'Help' });
      await rememberMeTooltipIcon.click();
    });
  }

  async expectRememberMeTooltipTextToBeVisible(text: string): Promise<void> {
    await test.step(`Verify Remember Me tooltip text is visible: ${text}`, async () => {
      await expect(this.rememberMeTooltip.getByText(text)).toBeVisible();
    });
  }

  async clickRememberMeTooltipXCloseButton(): Promise<void> {
    await test.step(`Click Remember Me tooltip close button`, async () => {
      const rememberMeTooltipXCloseButton = this.rememberMeTooltip.getByRole('button', { name: 'Close' });
      await rememberMeTooltipXCloseButton.click();
    });
  }

  async expectRememberMeTooltipNotToBeVisible(): Promise<void> {
    await test.step(`Verify Remember Me tooltip is not visible`, async () => {
      await expect(this.rememberMeTooltip).not.toBeVisible();
    });
  }

  async clickGoToBirdWorldLink(): Promise<void> {
    await test.step(`Click Go to Bird World link`, async () => {
      const goToBirdWorldLink = this.page.getByRole('link', { name: 'Go to Bird World' });
      await goToBirdWorldLink.click();
    });
  }

}