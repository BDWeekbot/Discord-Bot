import { Ballot } from './activatePollListener.function';
import { tally } from './activatePollListener.function';

describe('tally', () => {
    it('should return the only option if there is only one option', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are two options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are three options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option3',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are four options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option3',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        ballots.set('4', {
            userID: '4',
            username: 'user4',
            primarySelection: 'option4',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        expect(tally(ballots)).toBe('option1');
    });
});
